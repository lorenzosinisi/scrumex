defmodule Scrumpointer.Repo.Migrations.AddMoreFieldsToEntries do
  use Ecto.Migration

  def change do
    alter table(:entries) do
      add :votes_count, :integer, default: 0
    end
  end
end
