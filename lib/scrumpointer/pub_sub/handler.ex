defmodule Scrumpointer.PhoenixPostgresPubSub do
  alias Scrumpointer.Repo
  alias Scrumpointer.Web.Project
  alias ScrumpointerWeb.Coherence.UserEmail
  alias ScrumpointerWeb.Coherence.ProjectEmail
  alias ScrumpointerWeb.Coherence.Mailer

  def handle_postgres_notification(
        {:ok, %{"id" => project_id, "table" => "projects", "type" => "INSERT"}},
        _
      ) do
    project =
      Repo.get(Project, project_id)
      |> Repo.preload(:user)

    ProjectEmail.onboarding(project)
    |> Mailer.deliver()

    ProjectEmail.admin_onboarding(project)
    |> Mailer.deliver()
  end

  def handle_postgres_notification(_, _), do: nil
end
