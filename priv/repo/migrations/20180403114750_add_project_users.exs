defmodule Scrumpointer.Repo.Migrations.AddProjectUsers do
  use Ecto.Migration

  def change do
    create table(:project_users, primary_key: false) do
      add(:project_id, references(:projects))
      add(:user_id, references(:users))

      timestamps()
    end

    create(unique_index(:project_users, [:project_id, :user_id]))
  end
end
