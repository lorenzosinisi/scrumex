defmodule ScrumpointerWeb.Api.Team do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User
  alias Scrumpointer.Web.Project

  plug(:set_project!)

  def index(%{assigns: %{current_user: user, project: project}} = conn, _) do
    team_members = Project.team(user, project.id)
    render(conn, "index.json", team: team_members)
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    conn |> assign(:project, project)
  end
end
