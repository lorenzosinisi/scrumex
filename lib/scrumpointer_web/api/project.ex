defmodule ScrumpointerWeb.Api.Project do
  use ScrumpointerWeb, :controller
  alias Scrumpointer.Web.Project
  alias Scrumpointer.Web

  plug(:restrict_to_owner! when action in [:update, :delete])

  def index(%{assigns: %{current_user: user}} = conn, _) do
    my_projects = Project.list_mine(user)
    collaborating = Project.list_collaborating(user)
    render(conn, "index.json", projects: my_projects, collaborating: collaborating)
  end

  def show(%{assigns: %{current_user: user}} = conn, %{"project_id" => id}) do
    project =
      Project.get(%{user_email: user.email, user: user, id: id})
      |> Web.preload([:polls, :lists, :subscription])

    render(conn, "show.json", project: project)
  end

  def create(%{assigns: %{current_user: user}} = conn, %{"project" => project_params}) do
    case Project.create_from_api(user, project_params) do
      {:ok, project} ->
        conn
        |> render("show.json", project: project)

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(422)
        |> render("error.json", changeset: changeset)
    end
  end

  def update(%{assigns: %{current_user: user}} = conn, %{"project" => project_params}) do
    case Project.update_from_api(user, project_params) do
      %Project{} = project ->
        render(conn, "show.json", project: project)

      {:ok, %Project{} = project} ->
        render(conn, "show.json", project: project)

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(422)
        |> render("error.json", changeset: changeset)
    end
  end

  def delete(%{assigns: %{current_user: user}} = conn, %{"project_id" => id}) do
    Web.delete_project(user, id)
    render(conn, "delete.json", message: "ok")
  end

  defp restrict_to_owner!(%{assigns: %{current_user: user}} = conn, _) do
    is_owner = Project.get(conn.params["project_id"]) |> Project.owner?(user)

    if is_owner do
      conn
    else
      halt(conn)
    end
  end
end
