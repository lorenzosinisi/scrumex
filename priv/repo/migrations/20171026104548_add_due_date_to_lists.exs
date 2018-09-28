defmodule Scrumpointer.Repo.Migrations.AddDueDateToLists do
  use Ecto.Migration

  def change do
    alter table(:lists) do
      add :due_date, :utc_datetime
    end
  end
end
