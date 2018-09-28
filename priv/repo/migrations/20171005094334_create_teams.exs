defmodule Scrumpointer.Repo.Migrations.CreateTeams do
  use Ecto.Migration

  def change do
    create table(:teams) do
      add :name, :string
      add :member_emails, {:array, :string}
      add :owner_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:teams, [:owner_id])
  end
end
