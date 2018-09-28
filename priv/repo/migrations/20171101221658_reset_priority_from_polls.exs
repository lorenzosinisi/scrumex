defmodule Scrumpointer.Repo.Migrations.ResetPriorityFromPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      remove :priority
      add :priority, :decimal, default: 0.0
    end
  end
end
