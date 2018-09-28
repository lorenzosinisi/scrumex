defmodule Scrumpointer.Repo.Migrations.AddScaleTypeToPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add :scale_type, :string
    end

    create index(:polls, [:scale_type])
  end
end
