defmodule Scrumpointer.Repo.Migrations.AddClosedToLists do
  use Ecto.Migration

  def change do
    alter table(:lists) do
      add :closed, :boolean
    end
  end
end
