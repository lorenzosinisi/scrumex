defmodule ScrumpointerWeb.Api.SearchStoriesView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("index.json", %{stories: stories}) do
    Enum.map(stories, &story_json/1)
  end

  def story_json(story) do
    %{
      closed: story.closed,
      id: uui_to_string(story.id),
      project_id: story.project_id,
      scale_type: story.scale_type,
      title: story.title,
      user_id: story.user_id,
      list_id: story.list_id,
      description: story.description,
      assignee_id: story.assignee_id
    }
  end

  defp uui_to_string(binary) do
    {:ok, string} = Ecto.UUID.load(binary)
    string
  end
end
