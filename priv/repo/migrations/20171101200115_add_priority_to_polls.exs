defmodule Scrumpointer.Repo.Migrations.AddPriorityToPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add :priority, :decimal, default: 0.0
    end
  end
end
