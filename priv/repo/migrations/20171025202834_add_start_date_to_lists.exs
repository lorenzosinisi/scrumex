defmodule Scrumpointer.Repo.Migrations.AddStartDateToLists do
  use Ecto.Migration

  def change do
    alter table(:lists) do
      add :start_date, :utc_datetime
    end
  end
end
