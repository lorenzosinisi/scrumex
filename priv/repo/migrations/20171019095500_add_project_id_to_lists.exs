defmodule Scrumpointer.Repo.Migrations.AddProjectIdToLists do
  use Ecto.Migration

  def change do
    alter table(:lists) do
      add :project_id, references(:projects, on_delete: :delete_all)
    end
    create index(:lists, [:project_id])
  end
end
