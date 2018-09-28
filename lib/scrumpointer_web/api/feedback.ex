defmodule ScrumpointerWeb.Api.Feedback do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User

  plug(:set_project!)

  def index(%{assigns: %{current_user: _user, project: project}} = conn, _params) do
    render(
      conn,
      "index.json",
      feedback: Scrumpointer.Feedback.list(project.id)
    )
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    assign(conn, :project, project)
  end
end
