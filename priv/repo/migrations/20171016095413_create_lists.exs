defmodule Scrumpointer.Repo.Migrations.CreateLists do
  use Ecto.Migration

  def change do
    create table(:lists) do
      add :name, :string
      add :duration, :integer
      add :type, :string
      add :points, :integer
      add :team_id, references(:teams, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:lists, [:team_id])
    create index(:lists, [:user_id])
  end
end
