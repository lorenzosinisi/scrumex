defmodule Scrumpointer.Repo.Migrations.AddPostgresListenerForMemberChanges do
  use Ecto.Migration

  def change do
    execute("
            CREATE OR REPLACE FUNCTION broadcast_users_changes()
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
                'users_changes',
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
            CREATE TRIGGER notify_users_changes_trigger
            AFTER INSERT OR UPDATE
            ON users
            FOR EACH ROW EXECUTE PROCEDURE broadcast_users_changes();")
  end
end
