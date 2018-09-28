defmodule Scrumpointer.Repo.Migrations.AddRepositoryIdToPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add :repository_id, references(:repositories, on_delete: :nilify_all)
    end
    create index(:polls, [:repository_id])
  end
end
