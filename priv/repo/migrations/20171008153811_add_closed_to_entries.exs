defmodule Scrumpointer.Repo.Migrations.AddClosedToEntries do
  use Ecto.Migration

  def change do
    alter table(:entries) do
      add :closed, :boolean, default: false, null: false
    end
  end
end
