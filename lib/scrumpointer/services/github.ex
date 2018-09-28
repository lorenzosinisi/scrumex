defmodule Scrumpointer.Services.GitHub do
  alias Tentacat.{Repositories, Organizations, Milestones}

  @cache_name Application.get_env(:cachex, :key)
  # 10 minutes
  @cache_expire_in_seconds 600

  def client(nil), do: {:error, :no_token_given}
  def client(access_token), do: Tentacat.Client.new(%{access_token: access_token})

  def organizations(access_token) do
    Organizations.list_mine(client(access_token))
  end

  def repos(access_token, organization_name) do
    Repositories.list_orgs(organization_name, client(access_token))
  end

  def find_or_create_milestone(owner, name, sprint_name, client) do
    milestone =
      Tentacat.Milestones.list(owner, name, client)
      |> Enum.find(fn milestone -> match?(%{"title" => sprint_name}, milestone) end)

    case milestone do
      nil ->
        {201, new_milestone} =
          Tentacat.Milestones.create(owner, name, [title: sprint_name], client)

        new_milestone

      milestone ->
        milestone
    end
  end

  def add_milestone_to_issue(owner, name, issue_number, sprint_name, client) do
    %{"number" => id} = __MODULE__.find_or_create_milestone(owner, name, sprint_name, client)
    Tentacat.Issues.update(owner, name, issue_number, %{"milestone" => id}, client)
  end

  @doc """
    Given a valid GitHub access token, returns a list of owned repos and repos
    in organizations where I have granted access to this application.
  """
  def all_repos(access_token, user_id) do
    key = cache_key(user_id, "all_repos")

    case get_cache(key) do
      {:ok, value} ->
        value

      {:missing, nil} ->
        do_all_repos(access_token, user_id)
    end
  end

  @doc """
    GitHub.create_issue "user_token", %{owner: owner, repo: repo, body: body, title: title}}
  """
  def create_issue(access_token, %{owner: owner, repo: repo, body: body, title: title} = params) do
    me = client(access_token)
    Tentacat.Issues.create(owner, repo, %{"title" => title, "body" => body}, me)
  end

  def assign_milestone(access_token, %{name: repo, owner: owner}, %{github_number: number}, %{
        name: title
      }) do
    me = client(access_token)
    Tentacat.Issues.update(owner, repo, number, %{"milestone" => title}, me)
  end

  defp do_all_repos(access_token, user_id) do
    key = cache_key(user_id, "all_repos")

    try do
      me = client(access_token)

      orgs =
        Task.async(fn -> Organizations.list_mine(me) end)
        |> Task.await()
        |> Enum.map(fn %{"login" => login} -> login end)
        |> Enum.map(fn name -> Task.async(fn -> Repositories.list_orgs(name, me) end) end)
        |> Enum.map(&Task.await/1)
        |> List.flatten()

      mine =
        Task.async(fn -> Repositories.list_mine(me, type: "owner") end)
        |> Task.await()

      all =
        Enum.concat(mine, orgs)
        |> Enum.map(fn %{"name" => name, "id" => id} = repo ->
          %{name: name, id: id, owner: repo["owner"]["login"], data: repo}
        end)

      result = {:ok, %{all: all, mine: mine, organizations: orgs, count: Enum.count(all)}}
      set_cache(key, result)

      result
    catch
      :exit, _ -> {:error, "Something went wrong. Please try again."}
    end
  end

  defp set_cache(key, value) do
    Cachex.set(@cache_name, key, value, ttl: :timer.seconds(@cache_expire_in_seconds))
  end

  defp cache_key(user_id, function) do
    "#{user_id}:#{function}"
  end

  defp get_cache(key), do: Cachex.get(@cache_name, key)
end
