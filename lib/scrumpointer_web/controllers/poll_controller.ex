defmodule ScrumpointerWeb.PollController do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Poll
  use ScrumpointerWeb.Helpers.User
  use ScrumpointerWeb.Helpers.Project

  alias Scrumpointer.Web
  alias Scrumpointer.Web.{Poll, Project}
  alias Scrumpointer.Repo

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
           :delete
         ]
  )

  def index(%{assigns: %{project: project}} = conn, _) do
    polls = Web.list_polls(current_user(conn), project)
    render(conn, "index.html", polls: polls, project: project)
  end

  def new(%{assigns: %{project: project}} = conn, _) do
    changeset = Web.change_poll(%Poll{project_id: project.id})
    render(conn, "new.html", changeset: changeset, entries: [], project: project)
  end

  def create(%{assigns: %{project: project}} = conn, %{"poll" => poll_params}) do
    user = current_user(conn)
    poll_params = Map.put(poll_params, "user_id", user.id)
    Map.put(poll_params, "project_id", project.id)

    Repo.transaction(fn ->
      case Web.create_poll(poll_params) do
        {:ok, poll} ->
          Web.create_poll_entries(poll.id, poll_params["scale_type"], poll_params["entries"])

          conn
          |> put_flash(:info, "Created successfully. Share the URL with your team!")
          |> redirect(to: poll_path(conn, :show, project, poll))

        {:error, %Ecto.Changeset{} = changeset} ->
          render(conn, "new.html", changeset: changeset, project: project)
      end
    end)
  end

  def show(%{assigns: %{project: project}} = conn, %{"id" => id}) do
    poll =
      current_poll(id, project.id)
      |> Web.preload([:team, entries: :votes])

    case poll do
      poll = %Poll{} ->
        render(conn, "show.html", poll: poll, entries: poll.entries, project: project)

      nil ->
        conn
        |> put_flash(:error, "Ask the administrator to add your you to the team first")
        |> redirect(to: page_path(conn, :index))
    end
  end

  def edit(%{assigns: %{project: project}} = conn, %{"id" => id}) do
    user = current_user(conn)
    poll = Web.get_poll!(id, user.id) |> Web.preload([:entries, :team])
    changeset = Web.change_poll(poll)

    render(
      conn,
      "edit.html",
      poll: poll,
      changeset: changeset,
      entries: poll.entries,
      project: project
    )
  end

  def update(%{assigns: %{project: project}} = conn, %{"id" => id, "poll" => poll_params}) do
    user = current_user(conn)
    poll = Web.get_poll!(id, user.id)

    case Web.update_poll(poll, poll_params) do
      {:ok, poll} ->
        conn
        |> put_flash(:info, "updated successfully.")
        |> redirect(to: poll_path(conn, :show, project, poll))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", poll: poll, changeset: changeset, project: project)
    end
  end

  def delete(%{assigns: %{project: project}} = conn, %{"id" => id}) do
    user = current_user(conn)
    poll = Web.get_poll!(id, user.id)

    {:ok, _poll} = Web.delete_poll(poll)

    conn
    |> put_flash(:info, "deleted successfully.")
    |> redirect(to: poll_path(conn, :index, project))
  end

  defp set_project!(conn, _) do
    id = conn.params["project"]
    user = current_user(conn)
    project = current_project(id, user)
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
    if project.user_id == user.id do
      conn
    else
      conn
      |> put_flash(:error, "You can't access this resource.")
      |> redirect(to: "/")
    end
  end
end
