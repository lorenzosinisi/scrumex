defmodule ScrumpointerWeb.Api.Entry do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User
  alias Scrumpointer.Web.Poll
  alias Scrumpointer.Web

  plug(:set_project!)
  plug(:set_story!)

  def index(%{assigns: %{poll: poll}} = conn, _) do
    render(conn, "index.json", entries: Web.list_entries(poll.id))
  end

  defp set_story!(conn, _) do
    poll =
      Scrumpointer.Repo.get_by!(
        Poll,
        id: conn.params["issue_id"],
        project_id: conn.params["project_id"]
      )

    conn |> assign(:poll, poll)
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    conn |> assign(:project, project)
  end
end
