defmodule Scrumpointer.Admin.Dashboard do
  alias Scrumpointer.Repo
  import Ecto.Query, warn: false

  def last_users(limit \\ 200) do
    from(
      p in Scrumpointer.Coherence.User,
      order_by: [asc: :id],
      limit: ^limit
    )
    |> Repo.all()
  end

  def users_count() do
    from(
      p in Scrumpointer.Coherence.User,
      select: count(p.id)
    )
    |> Repo.one()
  end

  def last_projects(limit \\ 200) do
    from(
      p in Scrumpointer.Web.Project,
      order_by: [asc: :id],
      limit: ^limit
    )
    |> Repo.all()
  end

  def projects_count() do
    from(
      p in Scrumpointer.Web.Project,
      select: count(p.id)
    )
    |> Repo.one()
  end

  def last_stories(limit \\ 200) do
    from(
      p in Scrumpointer.Web.Poll,
      order_by: [asc: :id],
      limit: ^limit
    )
    |> Repo.all()
  end

  def stories_count() do
    from(p in Scrumpointer.Web.Poll, select: count(p.id))
    |> Repo.one()
  end
end
