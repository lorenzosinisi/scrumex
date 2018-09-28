defmodule Scrumpointer.Repo.Migrations.CreateNotification do
  use Ecto.Migration

  def change do
    create table(:notifications) do
      add :action, :string
      add :resource_type, :string
      add :user_id, references(:users, on_delete: :delete_all)
      add :creator_id, references(:users, on_delete: :delete_all)

      timestamps()
    end

    create index(:notifications, [:user_id])
    create index(:notifications, [:creator_id])
  end
end
