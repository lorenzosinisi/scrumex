defmodule ScrumpointerWeb.Api.Github do
  use ScrumpointerWeb, :controller

  def repos(%{assigns: %{current_user: user}} = conn, _) do
    {:ok, %{all: repos}} = Scrumpointer.Services.GitHub.all_repos(user.token, user.id)
    render(conn, "repos.json", repos: repos)
  end
end
