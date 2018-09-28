defmodule ScrumpointerWeb.Api.SearchStories do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User
  plug(:set_project!)

  def index(%{assigns: %{current_user: _user, project: %{id: project_id}}} = conn, %{
        "term" => search_term
      }) do
    render(
      conn,
      "index.json",
      stories: Scrumpointer.Stories.search(search_term, project_id, 1000)
    )
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    conn |> assign(:project, project)
  end
end
