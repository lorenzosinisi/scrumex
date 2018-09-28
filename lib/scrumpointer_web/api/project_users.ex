defmodule ScrumpointerWeb.Api.ProjectUsers do
  use ScrumpointerWeb, :controller
  alias Scrumpointer.Web
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User
  alias Scrumpointer.ProjectUsers

  plug(:set_project!)
  plug(:restrict_to_owner!)

  def add(%{assigns: %{current_user: _user, project: project}} = conn, %{
        "user_email" => user_email
      }) do
    %_{project_users: project_users, user_invitations: user_invitations} =
      case ProjectUsers.add_user_to_project(project_id: project.id, user_email: user_email) do
        {:ok, _} -> Web.preload(project, [:users, :user_invitations, :project_users])
        something -> {:error, something}
      end

    render(
      conn,
      "index.json",
      project_users: project_users,
      user_invitations: user_invitations
    )
  end

  def remove(%{assigns: %{current_user: user, project: project}} = conn, %{
        "user_email" => user_email
      }) do
    ProjectUsers.remove_user_from_project(
      project_id: project.id,
      user_email: user_email,
      user_id: user.id
    )

    project = Web.preload(project, [:project_users, :user_invitations])

    render(
      conn,
      "index.json",
      project_users: project.project_users,
      user_invitations: project.user_invitations
    )
  end

  def index(%{assigns: %{current_user: _user, project: project}} = conn, _params) do
    project = Web.preload(project, [:users, :user_invitations])

    render(
      conn,
      "index.json",
      project_users: project.users,
      user_invitations: project.user_invitations
    )
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    assign(conn, :project, project)
  end

  defp restrict_to_owner!(%{assigns: %{current_user: user}} = conn, _) do
    is_owner =
      Scrumpointer.Web.Project.get(conn.params["project_id"])
      |> Scrumpointer.Web.Project.owner?(user)

    if is_owner do
      conn
    else
      halt(conn)
    end
  end
end
