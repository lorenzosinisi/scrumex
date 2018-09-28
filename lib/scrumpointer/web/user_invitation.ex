defmodule Scrumpointer.Web.UserInvitation do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.{UserInvitation, Project}

  schema "user_invitations" do
    field(:email, :string)
    belongs_to(:project, Project)
    field(:invitation_token, :string, default: Ecto.UUID.generate())

    timestamps()
  end

  @doc false
  def changeset(%UserInvitation{} = user_invitation, attrs) do
    user_invitation
    |> cast(attrs, [:project_id, :email])
    |> validate_required([:project_id, :email])
  end
end
