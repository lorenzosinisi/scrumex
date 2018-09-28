defmodule Scrumpointer.Repo.Migrations.AddResetPasswordSentAtToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :confirmation_sent_at, :utc_datetime
    end
  end
end
