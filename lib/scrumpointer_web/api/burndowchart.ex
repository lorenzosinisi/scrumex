defmodule ScrumpointerWeb.Api.Burndownchart do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User

  plug(:set_project!)

  def show(%{assigns: %{project: project}} = conn, %{"sprint_id" => sprint_id}) do
    burndownchart = Scrumpointer.BusinessLogic.get_burndown_chart(project.id, sprint_id, [])
    render(conn, "show.json", burndownchart: burndownchart)
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    assign(conn, :project, project)
  end
end
