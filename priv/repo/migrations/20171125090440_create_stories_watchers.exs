defmodule Scrumpointer.Repo.Migrations.CreateStoriesWatchers do
  use Ecto.Migration

  def change do
    create table(:stories_watchers) do
      add :poll_id, :uuid
      add :user_id, :id
    end
    create unique_index(:stories_watchers, [:poll_id, :user_id])
  end
end
