defmodule Scrumpointer.Repo.Migrations.AddSubscriptions do
  use Ecto.Migration

  def change do
    create table(:subscriptions) do
      add(:project_id, references(:projects))
      add(:user_id, references(:users))
      add(:stripe_subscription_id, :string)

      timestamps()
    end

    create(unique_index(:subscriptions, [:project_id, :user_id]))
  end
end
