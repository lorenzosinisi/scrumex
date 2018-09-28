defmodule Scrumpointer.Repo.Migrations.CreateRepositories do
  use Ecto.Migration

  def change do
    create table(:repositories) do
      add :name, :string
      add :owner, :string
      add :github_id, :integer
      add :user_id, references(:users, on_delete: :nothing)
      add :project_id, references(:projects, on_delete: :nothing)

      timestamps()
    end

    create index(:repositories, [:user_id])
    create index(:repositories, [:project_id])
  end
end
