defmodule ScrumpointerWeb.ProjectController do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.User

  alias Scrumpointer.Web
  alias Scrumpointer.Web.Project
  alias Scrumpointer.Services.GitHub

  plug(
    :restrict_to_owner!
    when action in [
           :update,
           :delete,
           :edit,
           :show
         ]
  )

  def index(%{assigns: %{current_user: user}} = conn, _params) do
    projects = Web.list_projects(user) |> Web.preload([:repositories])
    collaborations = Project.list_collaborating(user)

    render(conn, "index.html", projects: projects, collaborations: collaborations)
  end

  def new(conn, _params) do
    changeset = Web.change_project(%Project{repositories: []})
    user = current_user(conn)

    case GitHub.all_repos(user.token, user.id) do
      {:ok, %{all: all}} ->
        conn
        |> render("new.html", changeset: changeset, project: %Project{}, repos: all)

      {:error, message} ->
        conn
        |> put_flash(:error, message <> " Please, refresh this page and try again.")
        |> redirect(to: project_path(conn, :new))

      true ->
        conn
        |> put_flash(:error, " Please, refresh this page and try again.")
        |> redirect(to: project_path(conn, :new))
    end
  end

  def create(%{assigns: %{current_user: user}} = conn, %{"project" => project_params}) do
    case Web.create_project(user, project_params) do
      {:ok, project} ->
        conn
        |> put_flash(:info, "Project created successfully.")
        |> redirect(to: project_path(conn, :show, project))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    project = Project.get(id)
    render(conn, "show.html", project: project)
  end

  def edit(conn, %{"id" => id}) do
    project = Web.get_project!(id)
    changeset = Web.change_project(project)
    render(conn, "edit.html", project: project, changeset: changeset)
  end

  def update(conn, %{"id" => id, "project" => project_params}) do
    project = Project.get(id)

    case Web.update_project(project, project_params) do
      {:ok, project} ->
        conn
        |> put_flash(:info, "Project updated successfully.")
        |> redirect(to: project_path(conn, :show, project))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", project: project, changeset: changeset)
    end
  end

  def delete(%{assigns: %{current_user: user}} = conn, %{"id" => id}) do
    {:ok, _project} = Web.delete_project(user, id)

    conn
    |> put_flash(:info, "Project deleted successfully.")
    |> redirect(to: project_path(conn, :index))
  end

  defp restrict_to_owner!(%{assigns: %{current_user: user}} = conn, _) do
    is_owner = Project.get(conn.params["id"]) |> Project.owner?(user)

    if is_owner do
      conn
    else
      conn
      |> put_flash(:error, "You can't access this resource.")
      |> redirect(to: "/")
    end
  end
end
