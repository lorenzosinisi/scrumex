defmodule Scrumpointer.Repo.Migrations.AddListIdToPolls do
  use Ecto.Migration


  def change do
    alter table(:polls) do
      add :list_id, references(:lists, on_delete: :nothing)
    end

    create index(:polls, [:list_id])
  end
end
