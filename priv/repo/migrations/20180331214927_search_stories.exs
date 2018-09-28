defmodule Scrumpointer.Repo.Migrations.SearchStories do
  use Ecto.Migration

  def change do
    execute("CREATE INDEX index_polls_on_title ON polls USING gin(to_tsvector('english', title))")

    execute(
      "CREATE INDEX index_polls_on_description ON polls USING gin(to_tsvector('english', description))"
    )

    execute("
      CREATE VIEW story_searches AS

      SELECT
        polls.id AS searchable_id,
        'Poll' AS searchable_type,
        polls.title AS term,
        polls.project_id AS project_id
      FROM polls

      UNION

      SELECT
        polls.id AS searchable_id,
        'Poll' AS searchable_type,
        polls.description AS term,
        polls.project_id AS project_id
      FROM polls
    ")
  end
end
