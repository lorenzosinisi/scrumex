defmodule ScrumpointerWeb.Api.Admin.DashboardView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("index.json", %{dashboard: dashboard}) do
    dashboard |> to_json()
  end

  def to_json(%{
        users: users,
        projects: projects,
        stories: stories,
        projects_count: projects_count,
        users_count: users_count,
        stories_count: stories_count
      }) do
    %{
      users: Enum.map(users, fn user -> user |> to_json(:user) end),
      projects: Enum.map(projects, fn project -> project |> to_json(:project) end),
      stories: Enum.map(stories, fn story -> story |> to_json(:story) end),
      projects_count: projects_count,
      users_count: users_count,
      stories_count: stories_count
    }
  end

  def to_json(user, :user) do
    %{id: user.id, email: user.email, name: user.name, inserted_at: user.inserted_at}
  end

  def to_json(project, :project) do
    %{
      id: project.id,
      name: project.name,
      inserted_at: project.inserted_at,
      user_id: project.user_id
    }
  end

  def to_json(story, :story) do
    %{id: story.id, name: story.title, inserted_at: story.inserted_at, user_id: story.user_id}
  end
end
