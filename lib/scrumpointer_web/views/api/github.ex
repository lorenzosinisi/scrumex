defmodule ScrumpointerWeb.Api.GithubView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("repos.json", %{repos: repos}) do
    Enum.map(repos, &repo_json/1)
  end

  defp repo_json(repo),
    do: %{
      owner: repo.owner,
      name: repo.name,
      full_name: repo.owner <> "/" <> repo.name,
      id: repo.id,
      data: %{}
    }
end
