defmodule Scrumpointer.Repo.Migrations.AddDescriptionToPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add :description, :text
    end
  end
end
