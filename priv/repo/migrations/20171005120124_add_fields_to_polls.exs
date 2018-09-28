defmodule Scrumpointer.Repo.Migrations.AddFieldsToPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add(:user_id, :integer, default: nil)
    end
  end
end
