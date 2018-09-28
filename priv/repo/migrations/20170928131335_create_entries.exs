defmodule Scrumpointer.Repo.Migrations.CreateEntries do
  use Ecto.Migration

  def change do
    create table(:entries, primary_key: false) do
      add :title, :string
      add :votes, :integer
      add :id, :binary_id, primary_key: true
      add :poll_id, references(:polls, on_delete: :nothing, type: :uuid)

      timestamps()
    end

    create index(:entries, [:poll_id])
  end
end
