defmodule Scrumpointer.Repo.Migrations.CreateEvents do
  use Ecto.Migration

  def change do
    create table(:events) do
      add(:name, :string)
      add(:resource_id, :string)
      add(:action, :string)
      add(:user_id, :string)

      timestamps()
    end

    create(index(:events, [:resource_id]))
    create(index(:events, [:user_id]))
    create(index(:events, [:name]))
  end
end
