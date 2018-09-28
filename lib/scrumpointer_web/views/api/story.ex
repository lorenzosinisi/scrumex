defmodule ScrumpointerWeb.Api.StoryView do
  @moduledoc false
  use ScrumpointerWeb, :view
  alias ScrumpointerWeb.Api.EntryView
  alias Scrumpointer.Web.Poll

  def render("index.json", %{issues: issues}) do
    Enum.map(issues, &issue_json/1)
  end

  def render("show.json", %{issue: issue}), do: issue_json(issue)

  def render("show.json", %{story: story}), do: story_json(story)

  def render("vote.json", %{issue: issue}), do: issue_json(issue, :vote)

  def render("error.json", %{changeset: c}), do: %{error: c}

  def render("delete.json", %{message: message}), do: %{message: message}

  def issue_json(issue, :vote) do
    %{
      closed: issue.closed,
      id: issue.id,
      project_id: issue.project_id,
      scale_type: issue.scale_type,
      title: issue.title,
      user_id: issue.user_id,
      list_id: issue.list_id,
      github_number: issue.github_number,
      description: issue.description,
      assignee_id: issue.assignee_id,
      entries: EntryView.to_ordered_json(issue.entries),
      story_points: Poll.story_points(issue),
      created_at: issue.inserted_at,
      updated_at: issue.updated_at
    }
  end

  def issue_json(issue) do
    %{
      closed: issue.closed,
      id: issue.id,
      project_id: issue.project_id,
      scale_type: issue.scale_type,
      title: issue.title,
      user_id: issue.user_id,
      list_id: issue.list_id,
      github_number: issue.github_number,
      description: issue.description,
      assignee_id: issue.assignee_id,
      story_points: Poll.story_points(issue),
      created_at: issue.inserted_at,
      updated_at: issue.updated_at
    }
  end

  def story_json(story) do
    %{
      closed: story.closed,
      id: story.id,
      project_id: story.project_id,
      scale_type: story.scale_type,
      title: story.title,
      user_id: story.user_id,
      list_id: story.list_id,
      github_number: story.github_number,
      description: story.description,
      story_points: Poll.story_points(story),
      assignee_id: story.assignee_id,
      created_at: story.inserted_at,
      updated_at: story.updated_at
    }
  end
end
