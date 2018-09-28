defmodule ScrumpointerWeb.ListController do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.User
  use ScrumpointerWeb.Helpers.Project

  plug(:set_project!)

  plug(
    :restrict_to_team_members!
    when action in [
           :show
         ]
  )

  plug(
    :restrict_to_owner!
    when action in [
           :update,
           :delete
         ]
  )

  alias Scrumpointer.Web
  alias Scrumpointer.Web.{List, Project}

  def index(%{assigns: %{project: project}} = conn, _) do
    lists = Web.list_lists(project) |> Web.preload([:polls])
    render(conn, "index.html", lists: lists, project: project)
  end

  def new(%{assigns: %{project: project}} = conn, _) do
    changeset = Web.change_list(%List{})
    render(conn, "new.html", changeset: changeset, project: project)
  end

  def create(%{assigns: %{project: project}} = conn, %{"list" => list_params}) do
    user = current_user(conn)

    params =
      Map.put(list_params, "user_id", user.id)
      |> Map.put("project_id", project.id)

    case Web.create_list(params) do
      {:ok, list} ->
        conn
        |> put_flash(:info, "List created successfully.")
        |> redirect(to: list_path(conn, :show, project, list))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset, project: project)
    end
  end

  def show(%{assigns: %{project: project}} = conn, %{"id" => id}) do
    list = Web.get_list!(id) |> Web.preload([:polls])
    render(conn, "show.html", list: list, project: project)
  end

  def edit(%{assigns: %{project: project}} = conn, %{"id" => id}) do
    list =
      Web.get_list!(id)
      |> Web.preload([:user])

    changeset = Web.change_list(list)
    render(conn, "edit.html", list: list, changeset: changeset, project: project)
  end

  def update(%{assigns: %{project: project}} = conn, %{"id" => id, "list" => list_params}) do
    user = current_user(conn)
    list = Web.get_list!(id)
    params = Map.put(list_params, "user_id", user.id)

    case Web.update_list(list, params) do
      {:ok, list} ->
        conn
        |> put_flash(:info, "List updated successfully.")
        |> redirect(to: list_path(conn, :show, project, list))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", list: list, changeset: changeset, project: project)
    end
  end

  def delete(%{assigns: %{project: project}} = conn, %{"id" => id}) do
    list = Web.get_list!(id)
    {:ok, _list} = Web.delete_list(list)

    conn
    |> put_flash(:info, "List deleted successfully.")
    |> redirect(to: list_path(conn, :index, project))
  end

  defp set_project!(conn, _) do
    project_id = conn.params["project"]
    user = current_user(conn)
    project = current_project(project_id, user)
    assign(conn, :project, project)
  end

  defp restrict_to_team_members!(%{assigns: %{project: project}} = conn, _) do
    case project do
      nil ->
        conn
        |> put_flash(:error, "You can't access this resource.")
        |> redirect(to: "/")

      %Project{} ->
        conn
    end
  end

  defp restrict_to_owner!(%{assigns: %{project: project, current_user: user}} = conn, _) do
    is_owner = project |> Project.owner?(user)

    if is_owner do
      conn
    else
      conn
      |> put_flash(:error, "You can't access this resource.")
      |> redirect(to: "/")
    end
  end
end
