defmodule ScrumpointerWeb.Api.Story do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User
  alias Scrumpointer.Web
  alias Scrumpointer.Web.{Poll, Project, List}
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.BusinessLogic

  plug(:set_project!)
  plug(:restrict_to_team_members! when action in [:index, :create])

  def index(%{assigns: %{current_user: user, project: project}} = conn, _) do
    case project do
      %Project{} = project ->
        render(conn, "index.json", issues: Web.list_polls(user, project))

      _ ->
        render(conn, "error.json", changeset: %{})
    end
  end

  def close!(%{assigns: %{current_user: _user, project: project}} = conn, %{"story_id" => id}) do
    [id, project.id]
    |> BusinessLogic.close_story([])
    |> case do
      {:ok, story} ->
        render(conn, "show.json", story: story)

      {:error, error} ->
        conn
        |> put_status(422)
        |> render("error.json", changeset: error)
    end
  end

  @doc """
  POST api/projects/:project_id/issues/new with data:
    {
     "issue": {
      "scale_type": STRING,
        "entries": ARRAY,
        "title": STRING
     }
    }
  It will return a json object describing the issue just created
    {
      "user_id": 60,
      "title": "Some kind of issue",
      "scale_type": "fibonacci_scale",
      "project_id": 35,
      "id": "21b718ce-0571-417d-9f0d-dffe0892f57a",
      "closed": false
    }
  """
  def create(%{assigns: %{current_user: user, project: project}} = conn, %{
        "issue" => issue_params
      }) do
    case Poll.create(%User{} = user, %Project{} = project, issue_params) do
      {:ok, issue} ->
        render(conn, "show.json", issue: issue)

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

  @doc """
    GET api/projects/:project_id/stories/:story_id
  """
  def show(%{assigns: %{current_user: _, project: project}} = conn, %{"story_id" => id}) do
    case Poll.get!(%{poll_id: id, project_id: project.id}) do
      %Poll{} = story ->
        story = Web.preload(story, [:entries])
        render(conn, "show.json", story: story)

      _ ->
        conn
        |> put_status(500)
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  @doc """
    Assign a story to a user
    PATCH api/projects/:project_id/stories/:story_id/assign_to/:user_id
  """
  def assign_to_user(%{assigns: %{current_user: user, project: project}} = conn, %{
        "story_id" => id,
        "user_id" => _user_id
      }) do
    case Poll.get!(%{poll_id: id, project_id: project.id}) do
      %Poll{} = story ->
        {:ok, story} = Poll.assign_to_user(story, user.id)
        story = Web.preload(story, [:entries])
        render(conn, "show.json", story: story)

      _ ->
        conn
        |> put_status(500)
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  @doc """
    Unassign a story
    PATCH api/projects/:project_id/stories/:story_id/assign_to/:user_id
  """
  def assign_to_user(%{assigns: %{current_user: _user, project: project}} = conn, %{
        "story_id" => id
      }) do
    case Poll.get!(%{poll_id: id, project_id: project.id}) do
      %Poll{} = story ->
        {:ok, story} = Poll.assign_to_user(story, nil)
        story = Web.preload(story, [:entries])

        render(conn, "show.json", story: story)

      _ ->
        conn
        |> put_status(500)
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  @doc """
    Update story title and description
    PATCH api/projects/:project_id/stories/:story_id/assign_to/:user_id
  """
  def update(%{assigns: %{current_user: user, project: project}} = conn, %{
        "story_id" => id,
        "title" => title,
        "description" => description,
        "list_id" => list_id
      }) do
    case Poll.get!(%{poll_id: id, project_id: project.id}) do
      %Poll{} = story ->
        {:ok, _story} =
          {:ok, updated_story} =
          Scrumpointer.BusinessLogic.update_a_story([
            story,
            list_id_to_integer(list_id, project.id),
            title,
            description,
            user.id
          ])

        render(conn, "show.json", story: updated_story)

      _ ->
        conn
        |> put_status(500)
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  defp list_id_to_integer("", project_id) do
    # return the backlog
    %{id: id} =
      Scrumpointer.Repo.get_by(Scrumpointer.Web.List, project_id: project_id, type: "backlog")

    id
  end

  defp list_id_to_integer(id, _project_id) when is_number(id) do
    id
  end

  defp list_id_to_integer(id, _project_id) when is_binary(id) do
    String.to_integer(id)
  end

  def rank_first(%{assigns: %{current_user: _user, project: project}} = conn, %{"story_id" => id}) do
    case Poll.get!(%{poll_id: id, project_id: project.id}) do
      %Poll{} = story ->
        {:ok, story} = Poll.rank_first(story)
        story = Web.preload(story, [:entries])
        render(conn, "show.json", story: story)

      _ ->
        conn
        |> put_status(500)
        |> halt
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  def rank_last(%{assigns: %{current_user: _user, project: project}} = conn, %{"story_id" => id}) do
    case Poll.get!(%{poll_id: id, project_id: project.id}) do
      %Poll{} = story ->
        {:ok, story} = Poll.rank_last(story)
        story = Web.preload(story, [:entries])
        render(conn, "show.json", story: story)

      _ ->
        conn
        |> put_status(500)
        |> halt
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  def rank_between(%{assigns: %{current_user: _user, project: project}} = conn, %{
        "story_id" => id,
        "prev_story" => prev_story_id,
        "next_story" => next_story_id
      }) do
    poll = Poll.get!(%{poll_id: id, project_id: project.id})
    this = Poll.get!(%{poll_id: prev_story_id, project_id: project.id})
    that = Poll.get!(%{poll_id: next_story_id, project_id: project.id})

    case poll do
      %Poll{} = story ->
        {:ok, story} = Poll.place_between(story, this, that)
        story = Web.preload(story, [:entries])
        render(conn, "show.json", story: story)

      _ ->
        conn
        |> put_status(500)
        |> halt
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  @doc """
  Assign a story to the current user
  PATCH api/projects/:project_id/stories/:story_id/assign_to_me
  """
  def assign_to_me(%{assigns: %{current_user: user, project: project}} = conn, %{"story_id" => id}) do
    case Poll.get!(%{poll_id: id, project_id: project.id}) do
      %Poll{} = story ->
        if story.assignee_id !== nil do
          Poll.assign_to_user(story, nil)
        else
          Poll.assign_to_user(story, user.id)
        end

        story = Web.preload(story, [:entries])
        render(conn, "show.json", story: story)

      _ ->
        conn
        |> put_status(500)
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  def vote(%{assigns: %{current_user: _, project: project}} = conn, %{"issue_id" => id}) do
    case Poll.get!(%{poll_id: id, project_id: project.id}) do
      %Poll{} = poll ->
        poll = poll |> Web.preload([:entries])
        render(conn, "vote.json", issue: poll)

      _ ->
        conn
        |> put_status(500)
        |> render("error.json", changeset: "Something went wrong")
    end
  end

  def delete(%{assigns: %{current_user: _user, project: project}} = conn, %{"issue_id" => id}) do
    project |> Poll.delete(id)
    render(conn, "delete.json", message: "deleted")
  end

  def add_to_sprint(%{assigns: %{current_user: user, project: project}} = conn, %{
        "issue_id" => issue_id,
        "sprint_id" => sprint_id,
        "project_id" => project_id
      }) do
    sprint_id = list_id_to_integer(sprint_id, project_id)
    list = sprint(project, sprint_id)
    poll = issue(project, issue_id)

    case Poll.assign_to_sprint(user, poll, list) do
      {:ok, issue} ->
        render(conn, "show.json", issue: issue)

      {:error, error} ->
        conn
        |> put_status(422)
        |> render("error.json", changeset: error)
    end
  end

  def add_to_sprint(%{assigns: %{current_user: user, project: project}} = conn, %{
        "story_id" => issue_id,
        "sprint_id" => sprint_id,
        "project_id" => project_id
      }) do
    sprint_id = list_id_to_integer(sprint_id, project_id)
    list = sprint(project, sprint_id)
    poll = issue(project, issue_id)

    case Scrumpointer.BusinessLogic.assign_story_to_sprint([user, poll, list], []) do
      {:ok, story} ->
        render(conn, "show.json", story: story)

      {:error, error} ->
        conn
        |> put_status(422)
        |> render("error.json", changeset: error)
    end
  end

  defp issue(project, id) do
    Poll.get!(%{poll_id: id, project_id: project.id})
  end

  defp sprint(project, id) do
    List.get(project, id)
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    assign(conn, :project, project)
  end

  defp restrict_to_team_members!(%{assigns: %{project: project}} = conn, _) do
    case project do
      nil ->
        conn
        |> put_status(403)
        |> halt

      %Project{} ->
        conn
    end
  end
end
