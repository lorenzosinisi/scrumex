defmodule Scrumpointer.Repo.Migrations.AddGithubNumberToPolls do
  use Ecto.Migration

  def change do
    alter table(:polls) do
      add :github_number, :string
    end
  end
end
