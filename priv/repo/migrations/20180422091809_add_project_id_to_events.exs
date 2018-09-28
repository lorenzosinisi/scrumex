defmodule Scrumpointer.Repo.Migrations.AddProjectIdToEvents do
  use Ecto.Migration

  def change do
    alter table(:events) do
      add(:project_id, references(:projects, on_delete: :nilify_all))
    end
  end
end
