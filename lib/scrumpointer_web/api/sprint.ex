defmodule ScrumpointerWeb.Api.Sprint do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Web.{Project, List}
  alias Scrumpointer.Web
  alias Scrumpointer.BusinessLogic

  plug(:set_project!)

  def index(%{assigns: %{current_user: _user, project: project}} = conn, _) do
    render(conn, "index.json", sprints: Web.list_sprints(project))
  end

  @doc """
  POST api/projects/:project_id/sprints/new with data:
    {
      "sprint": {
        "name": "Some name",
        "duration": 2
      }
    }
  It will return a json object describing the issue just created
    {
      id:          sprint.id,
      name:        sprint.name,
      duration:    sprint.duration,
      user_id:     sprint.user_id,
      inserted_at: sprint.inserted_at,
      updated_at:  sprint.updated_at,
      project_id:  sprint.project_id,
      type:        sprint.type
    }
  """
  def create(%{assigns: %{current_user: user, project: project}} = conn, %{
        "sprint" => sprint_params
      }) do
    case List.create(%User{} = user, %Project{} = project, sprint_params) do
      {:ok, sprint} ->
        render(conn, "show.json", sprint: sprint)

      {:error, error} ->
        conn
        |> put_status(422)
        |> render("error.json", changeset: error)

      _ ->
        conn
        |> put_status(500)
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  def close!(%{assigns: %{current_user: user, project: project}} = conn, %{"sprint_id" => id}) do
    BusinessLogic.close_sprint([id, project, user], [])
    |> case do
      {:ok, sprint} ->
        render(conn, "show.json", sprint: sprint)

      {:error, error} ->
        conn
        |> put_status(422)
        |> render("error.json", changeset: error)
    end
  end

  def show(%{assigns: %{project: project}} = conn, %{"sprint_id" => id}) do
    sprint = List.get(project, id)
    render(conn, "show.json", sprint: sprint)
  end

  def delete(%{assigns: %{current_user: _user, project: project}} = conn, %{"sprint_id" => id}) do
    project |> List.delete(id)
    render(conn, "delete.json", message: "deleted")
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    assign(conn, :project, project)
  end
end
