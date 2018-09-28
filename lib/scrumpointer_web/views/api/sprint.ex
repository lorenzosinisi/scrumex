defmodule ScrumpointerWeb.Api.SprintView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("index.json", %{sprints: sprints}) do
    Enum.map(sprints, &to_json/1)
  end

  def render("show.json", %{sprint: sprint}), do: to_json(sprint)

  def render("error.json", %{changeset: c}), do: c

  def render("delete.json", %{message: message}), do: %{message: message}

  def to_json(sprint),
    do: %{
      id: sprint.id,
      name: sprint.name,
      duration: sprint.duration,
      user_id: sprint.user_id,
      inserted_at: sprint.inserted_at,
      updated_at: sprint.updated_at,
      project_id: sprint.project_id,
      type: sprint.type,
      start_date: sprint.start_date,
      due_date: sprint.due_date,
      closed: sprint.closed,
      story_points: story_points(sprint)
    }

  defp story_points(sprint) do
    sprint = Scrumpointer.Web.preload(sprint, [:polls])
    Scrumpointer.Web.List.story_points(sprint)
  end
end
