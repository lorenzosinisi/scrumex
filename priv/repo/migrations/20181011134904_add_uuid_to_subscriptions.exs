defmodule Scrumpointer.Repo.Migrations.AddUuidToSubscriptions do
  use Ecto.Migration

  def change do
    alter table(:subscriptions) do
      add(:uuid, :string)
    end

    create(unique_index(:subscriptions, [:uuid]))
  end
end
