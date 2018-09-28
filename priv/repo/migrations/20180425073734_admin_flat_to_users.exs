defmodule Scrumpointer.Repo.Migrations.AdminFlatToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add(:admin, :boolean)
    end
  end
end
