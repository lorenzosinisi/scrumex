defmodule Scrumpointer.Web.Project do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.{Project, Poll, List, Repository, ProjectUsers, UserInvitation}
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Repo
  import Ecto.Query, warn: false
  alias Scrumpointer.Services.GitHub

  schema "projects" do
    field(:name, :string)
    field(:user_id, :id)
    field(:team_emails, {:array, :string}, default: [])
    has_many(:polls, Poll, on_delete: :nilify_all)
    has_many(:user_invitations, UserInvitation, on_delete: :nilify_all)
    has_many(:lists, List, on_delete: :nilify_all)
    has_many(:repositories, Repository, on_delete: :nilify_all)
    has_many(:project_users_references, ProjectUsers, on_delete: :nilify_all)
    has_many(:project_users, through: [:project_users_references, :user])
    many_to_many(:users, User, join_through: ProjectUsers)

    timestamps()
  end

  @doc false
  def changeset(%Project{} = project, attrs) do
    project
    |> cast(attrs, [:name, :user_id, :team_emails])
    |> validate_required([:name, :user_id])
  end

  def check(changeset) do
    changeset
  end

  def get(%{user_email: user_email, user: user, id: id}) do
    Repo.get!(Project, id)
    |> Repo.preload([:users, :user_invitations])
    |> case do
      %Project{} = project ->
        cond do
          Enum.find(project.users, fn %{email: email} ->
            email == user.email
          end) ->
            project

          Enum.find(project.user_invitations, fn %{email: email} -> email == user.email end) ->
            Scrumpointer.ProjectUsers.add_user_to_project(
              project_id: project.id,
              user_id: user.id
            )

            Scrumpointer.UserInvitations.delete(project_id: project.id, user_email: user.email)

            project

          user.admin == true ->
            project

          user.id == project.user_id ->
            project

          true ->
            raise "Access denied."
        end

      nil ->
        raise "You can't access this Project with email #{user_email}"
    end
  end

  def get(%{user: user, id: id}) do
    get(%{user_email: user.email, user: user, id: id})
  end

  def get(%{user: user, id: id}, {:load, :github_repos}) do
    project = Project.get(%{user_email: user.email, user: user, id: id})

    case GitHub.all_repos(user.token, user.id) do
      {:ok, %{all: all}} ->
        project |> Map.put(:github_repos, all)

      {:error, message} ->
        raise "Something went wrong, #{message}."

      true ->
        raise "Something unexpected happened when fetching GitHub."
    end
  end

  def get(id) when is_binary(id) do
    Repo.get!(Project, id)
  end

  def list_mine(user) do
    from(t in Project, where: t.user_id == ^user.id)
    |> Repo.all()
  end

  def list_collaborating(user) do
    user_id = user.id

    projects_collaborating =
      Project
      |> where([u], ^user.email in u.team_emails)
      |> Repo.all()

    associations =
      from(p in Scrumpointer.Web.ProjectUsers, where: p.user_id == ^user_id)
      |> Repo.all()
      |> Repo.preload(:project)

    (projects_collaborating ++ Enum.map(associations, fn association -> association.project end))
    |> Enum.uniq()
    |> Enum.reject(&is_nil/1)
  end

  @doc """
    Given a map %Project{} that has a list :team_emails, and
    a %User{} that has an :email, checks if the user is a member of the
    project
  """
  def member?(project, user) do
    Project.get(%{user_email: user.email, user: user, id: project.id})
  end

  def create(user, attrs \\ %{}) do
    %Project{user_id: user.id}
    |> Project.changeset(attrs)
    |> Repo.insert()
  end

  def create_from_api(
        user,
        %{"collaborators" => collaborators, "name" => name, "repos" => repos} = _params
      ) do
    Repo.transaction(fn ->
      case Project.create(user, %{name: name, user_id: user.id, team_emails: collaborators}) do
        {:ok, %Project{} = project} ->
          Enum.map(repos, fn repo -> Repository.create(project, repo) end)
          project

        {:error, %Ecto.Changeset{} = error} ->
          {:error, error}
      end
    end)
  end

  def update_from_api(user, params) do
    %{
      "collaborators" => collaborators,
      "name" => name,
      "repositories" => repos,
      "id" => id
    } = params

    Repo.transaction(fn ->
      case Project.update(user, id, %{name: name, team_emails: collaborators}) do
        {:ok, %Project{} = project} ->
          project = Scrumpointer.Web.preload(project, [:repositories])
          Enum.each(project.repositories, fn repo -> Repo.delete(repo) end)
          Enum.each(repos, fn repo -> Repository.create(project, repo) end)

          Scrumpointer.Web.preload(project, [:repositories])

        {:error, %Ecto.Changeset{} = error} ->
          {:error, error}
      end
    end)
  end

  def update(user, project_id, attrs \\ %{}) do
    case Repo.get_by(Project, id: project_id, user_id: user.id) do
      %Project{} = project ->
        project
        |> Project.changeset(attrs)
        |> Repo.update()

      _ ->
        {:error, "Not found"}
    end
  end

  def team(user, project_id) do
    team_by_members =
      from(p in Scrumpointer.Web.ProjectUsers, where: p.project_id == ^project_id)
      |> Repo.all()
      |> Repo.preload(:user)

    Enum.map(team_by_members, fn association -> association.user end)
    |> Enum.uniq()
  end

  def delete(user, project_id) do
    Project
    |> Repo.get_by(id: project_id, user_id: user.id)
    |> Repo.delete()
  end

  def owner?(project, user), do: project.user_id == user.id
end
