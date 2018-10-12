defmodule Scrumpointer.Repo.Migrations.AddPostgresListenerForProjectsChanges do
  use Ecto.Migration

  def change do
    execute("
            CREATE OR REPLACE FUNCTION broadcast_projects_changes()
            RETURNS trigger AS $$
            DECLARE
              current_row RECORD;
            BEGIN
              IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
                current_row := NEW;
              ELSE
                current_row := OLD;
              END IF;
              IF (TG_OP = 'INSERT') THEN
                OLD := NEW;
              END IF;
            PERFORM pg_notify(
                'projects_changes',
                json_build_object(
                  'table', TG_TABLE_NAME,
                  'type', TG_OP,
                  'id', current_row.id
                )::text
              );
            RETURN current_row;
            END;
            $$ LANGUAGE plpgsql;")
    execute("
            CREATE TRIGGER notify_projects_changes_trigger
            AFTER INSERT OR UPDATE
            ON projects
            FOR EACH ROW EXECUTE PROCEDURE broadcast_projects_changes();")
  end
end
