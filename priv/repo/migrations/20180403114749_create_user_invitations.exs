defmodule Scrumpointer.Repo.Migrations.CreateUserInvitations do
  use Ecto.Migration

  def change do
    create table(:user_invitations) do
      add(:email, :string)
      add(:project_id, references(:projects, on_delete: :nilify_all))
      add(:invitation_token, :string)

      timestamps()
    end

    create(unique_index(:user_invitations, [:project_id, :email]))
  end
end
