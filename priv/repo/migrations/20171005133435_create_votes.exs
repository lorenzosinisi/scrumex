defmodule Scrumpointer.Repo.Migrations.CreateVotes do
  use Ecto.Migration

  def change do
    create table(:votes) do
      add :value, :integer
      add :user_id, references(:users, on_delete: :nothing)
      add :poll_id, references(:polls, on_delete: :nothing, type: :uuid)
      add :entry_id, references(:entries, on_delete: :nothing, type: :uuid)
      add :team_id, references(:teams, on_delete: :nothing)

      timestamps()
    end

    create index(:votes, [:user_id])
    create index(:votes, [:poll_id])
    create index(:votes, [:entry_id])
    create index(:votes, [:team_id])
    create unique_index(:votes, [:user_id, :poll_id])
  end
end
