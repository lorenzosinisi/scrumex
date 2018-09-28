defmodule Scrumpointer.Repo.Migrations.AddFieldsToPolls1 do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add :team_id, :integer, default: nil
    end
  end
end
