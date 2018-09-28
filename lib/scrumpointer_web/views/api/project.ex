defmodule ScrumpointerWeb.Api.ProjectView do
  alias ScrumpointerWeb.Api.StoryView
  alias ScrumpointerWeb.Api.SprintView
  alias ScrumpointerWeb.Api.RepositoryView
  alias Scrumpointer.Web.Backlog
  alias Scrumpointer.Web.ActiveSprints

  @moduledoc false
  use ScrumpointerWeb, :view
  alias Scrumpointer.Web

  def render("index.json", %{projects: projects, collaborating: collaborating}) do
    %{
      mine: Enum.map(projects, &project_json/1),
      collaborating: Enum.map(collaborating, &project_json/1)
    }
  end

  def render("show.json", %{project: project, extras: field_name}),
    do: project_with_extras_json(project, field_name)

  def render("show.json", %{project: project}), do: project_json(project)
  def render("error.json", %{changeset: c}), do: %{error: c}
  def render("ok.json", %{message: message}), do: message
  def render("delete.json", %{message: message}), do: %{ok: message}

  defp project_json(project) do
    project = Web.preload(project, [:polls, :repositories, :lists, :users])

    %{
      id: project.id,
      name: project.name,
      issues: Enum.map(project.polls, &StoryView.issue_json/1),
      backlog: Backlog.by_project(project) |> Enum.map(&StoryView.issue_json/1),
      repositories: Enum.map(project.repositories, &RepositoryView.to_json/1),
      collaborators:
        (project.team_emails ++ Enum.map(project.users, fn user -> user.email end)) |> Enum.uniq(),
      active_sprints: ActiveSprints.list(project.lists) |> Enum.map(&SprintView.to_json/1)
    }
  end

  defp project_with_extras_json(project, field_name) do
    {:ok, extra_data} = Map.fetch(project, field_name)
    project = Web.preload(project, [:repositories])

    %{
      id: project.id,
      name: project.name,
      "#{field_name}": extra_data,
      repositories: project.repositories
    }
  end
end
