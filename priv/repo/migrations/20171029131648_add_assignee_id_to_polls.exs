defmodule Scrumpointer.Repo.Migrations.AddAssigneeIdToPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add :assignee_id, references(:users)
    end
    create index(:polls, [:assignee_id])
  end
end
