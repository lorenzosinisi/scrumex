defmodule Scrumpointer.Repo.Migrations.AddProjectIdToPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add :project_id, references(:projects, on_delete: :delete_all)
    end

    create index(:polls, [:project_id])
  end
end
