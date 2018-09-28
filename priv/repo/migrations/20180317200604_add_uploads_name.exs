defmodule Scrumpointer.Repo.Migrations.AddUploadsName do
  use Ecto.Migration

  def change do
    alter table(:attachment_uploads) do
      add(:name, :string)
    end
  end
end
