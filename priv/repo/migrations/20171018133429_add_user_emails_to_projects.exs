defmodule Scrumpointer.Repo.Migrations.AddUserEmailsToProjects do
  use Ecto.Migration

  def change do
    alter table(:projects) do
      add :team_emails, {:array, :string}
    end
  end
end
