defmodule Scrumpointer.Repo.Migrations.AddUniqueIndexTypeAndProjectIdToLists do
  use Ecto.Migration

  def change do
    create unique_index(:lists, [:project_id, :name, :type])
  end
end
