defmodule Scrumpointer.Repo.Migrations.CreateComments do
  use Ecto.Migration

  def change do
    create table(:comments, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :body, :text
      add :user_id, references(:users, on_delete: :delete_all)
      add :poll_id, references(:polls, on_delete: :delete_all, type: :binary_id)
      add :project_id, references(:projects, on_delete: :delete_all)
      add :list_id, references(:lists, on_delete: :nilify_all)

      timestamps()
    end

    create index(:comments, [:user_id])
    create index(:comments, [:poll_id])
    create index(:comments, [:project_id])
    create index(:comments, [:list_id])
  end
end
