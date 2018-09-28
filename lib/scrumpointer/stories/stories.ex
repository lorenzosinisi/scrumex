defmodule Scrumpointer.Stories do
  alias Scrumpointer.{Web, Repo}

  @doc """
  Search for stories based on a provided term, using Postgres full-text search.

  Returns [Poll]
  """
  def search("", project_id, limit) when is_number(project_id) do
    Repo.execute_and_load(
      "select * from polls where id in (select searchable_id from story_searches where project_id = $1 limit $2) order by id desc;",
      [project_id, limit],
      Web.Poll
    )
  end

  def search(term, project_id, limit) when is_number(project_id) do
    formatted = term |> String.replace(" ", "|")

    Repo.execute_and_load(
      "select * from polls where id in (select searchable_id from story_searches where project_id = $2 and to_tsvector('english', term) @@ to_tsquery($1) limit $3);",
      [formatted, project_id, limit],
      Web.Poll
    )
  end
end
