defmodule ScrumpointerWeb.RepositoryController do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.User

  alias Scrumpointer.Web
  alias Scrumpointer.Web.Repository

  plug(:not_in_use!)

  def index(conn, _params) do
    repositories = Web.list_repositories()
    render(conn, "index.html", repositories: repositories)
  end

  def new(conn, _params) do
    changeset = Web.change_repository(%Repository{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"repository" => repository_params}) do
    case Web.create_repository(repository_params) do
      {:ok, repository} ->
        conn
        |> put_flash(:info, "Repository created successfully.")
        |> redirect(to: repository_path(conn, :show, repository))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    repository = Web.get_repository!(id)
    render(conn, "show.html", repository: repository)
  end

  def edit(conn, %{"id" => id}) do
    repository = Web.get_repository!(id)
    changeset = Web.change_repository(repository)
    render(conn, "edit.html", repository: repository, changeset: changeset)
  end

  def update(conn, %{"id" => id, "repository" => repository_params}) do
    repository = Web.get_repository!(id)

    case Web.update_repository(repository, repository_params) do
      {:ok, repository} ->
        conn
        |> put_flash(:info, "Repository updated successfully.")
        |> redirect(to: repository_path(conn, :show, repository))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", repository: repository, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    repository = Web.get_repository!(id)
    {:ok, _repository} = Web.delete_repository(repository)

    conn
    |> put_flash(:info, "Repository deleted successfully.")
    |> redirect(to: repository_path(conn, :index))
  end

  defp not_in_use!(conn, _) do
    conn
    |> put_flash(:error, "You can't access this resource.")
    |> redirect(to: "/")
  end
end
