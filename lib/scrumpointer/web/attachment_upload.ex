defmodule Scrumpointer.Web.AttachmentUpload do
  use Ecto.Schema
  import Ecto.Query, warn: false
  import Ecto.Changeset
  alias Scrumpointer.Web.{Poll, Project}
  alias Scrumpointer.Coherence.User

  schema "attachment_uploads" do
    field(:image_url, :string)
    field(:name, :string)
    belongs_to(:user, User)
    belongs_to(:poll, Poll, type: :binary_id)
    belongs_to(:project, Project)

    timestamps()
  end

  def changeset(struct, params \\ :invalid) do
    struct
    |> cast(params, [:image_url, :poll_id, :project_id, :user_id, :name])
    |> validate_required([:image_url, :poll_id, :name])
  end

  def list_from_params(%{"story_id" => poll_id, "project_id" => project_id}) do
    from(
      c in Scrumpointer.Web.AttachmentUpload,
      where: c.poll_id == ^poll_id and c.project_id == ^project_id
    )
    |> Scrumpointer.Repo.all()
  end
end
