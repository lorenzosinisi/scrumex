defmodule ScrumpointerWeb.Api.StoryWatchers do
  use ScrumpointerWeb, :controller
  alias Scrumpointer.Web.Poll
  alias Scrumpointer.Web
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User

  plug(:set_project!)

  def watch(%{assigns: %{current_user: user, project: project}} = conn, %{"story_id" => story_id}) do
    story = Poll.by_project(project.id, story_id)
    {:ok, _watching} = Scrumpointer.Web.StoryWatchers.watch(story.id, user.id)
    story = story |> Web.preload([:watchers])
    render(conn, "index.json", watchers: story.watchers)
  end

  def watchers(%{assigns: %{current_user: _user, project: project}} = conn, %{
        "story_id" => story_id
      }) do
    story = Poll.by_project(project.id, story_id) |> Web.preload([:watchers])
    render(conn, "index.json", watchers: story.watchers)
  end

  def unwatch(%{assigns: %{current_user: user, project: project}} = conn, %{
        "story_id" => story_id
      }) do
    story = Poll.by_project(project.id, story_id)
    {:ok, _watching} = Scrumpointer.Web.StoryWatchers.unwatch(story.id, user.id)
    story = story |> Web.preload([:watchers])
    render(conn, "index.json", watchers: story.watchers)
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    assign(conn, :project, project)
  end
end
