defmodule Scrumpointer.Repo.Migrations.AddUploads do
  use Ecto.Migration

  def change do
    create table(:attachment_uploads) do
      add(:image_url, :string)
      add(:user_id, references(:users, on_delete: :delete_all))
      add(:poll_id, references(:polls, on_delete: :delete_all, type: :binary_id))
      add(:project_id, references(:projects, on_delete: :delete_all))

      timestamps()
    end
  end
end
