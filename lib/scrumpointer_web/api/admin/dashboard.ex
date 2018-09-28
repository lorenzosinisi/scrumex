defmodule ScrumpointerWeb.Api.Admin.Dashboard do
  use ScrumpointerWeb, :controller
  alias Scrumpointer.Admin.Dashboard

  def index(%{assigns: %{current_user: _admin}} = conn, _params) do
    overview = %{
      users: Dashboard.last_users(),
      projects: Dashboard.last_projects(),
      stories: Dashboard.last_stories(),
      projects_count: Dashboard.projects_count(),
      users_count: Dashboard.users_count(),
      stories_count: Dashboard.stories_count()
    }

    render(conn, "index.json", dashboard: overview)
  end
end
