defmodule Scrumpointer.Repo.Migrations.AddConfirmationToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :confirmation_token, :string
      add :confirmed_at, :naive_datetime
    end
  end
end
