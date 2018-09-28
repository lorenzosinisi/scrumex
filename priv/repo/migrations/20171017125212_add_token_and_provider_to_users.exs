defmodule Scrumpointer.Repo.Migrations.AddTokenAndProviderToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :provider, :string
      add :token, :string
      add :github_data, :bytea
    end

    create index(:users, [:provider])
  end
end
