defmodule Scrumpointer.Repo.Migrations.CreatePolls do
  use Ecto.Migration

  def change do
    create table(:polls, primary_key: false) do
      add :title, :string
      add :id, :binary_id, primary_key: true
      add :closed, :boolean, default: false, null: false

      timestamps()
    end

  end
end
