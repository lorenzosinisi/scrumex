defmodule Scrumpointer.Web.Comment do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query, warn: false
  alias Scrumpointer.Web.Comment
  alias Scrumpointer.Repo
  alias Scrumpointer.Web.{Comment, Poll, List, Project}

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "comments" do
    field(:body, :string)
    belongs_to(:parent, Comment)
    belongs_to(:user, Scrumpointer.Coherence.User, type: :id)
    belongs_to(:poll, Poll)
    belongs_to(:project, Project, type: :id)
    belongs_to(:list, List, type: :id)
    has_many(:replies, Comment, on_delete: :delete_all, foreign_key: :parent_id)
    timestamps()
  end

  @doc false
  def changeset(%Comment{} = comment, attrs) do
    comment
    |> cast(attrs, [:body, :user_id, :project_id, :poll_id, :list_id, :parent_id])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:project_id)
    |> foreign_key_constraint(:poll_id)
    |> validate_required([:body, :user_id, :project_id, :poll_id])
  end

  def create(attrs \\ %{}) do
    %Comment{}
    |> Comment.changeset(attrs)
    |> Repo.insert()
  end

  def delete(id) do
    Repo.get(Comment, id) |> Repo.delete()
  end

  def list_from_params(%{"poll_id" => poll_id, "project_id" => project_id}) do
    from(
      c in Comment,
      where: c.poll_id == ^poll_id and c.project_id == ^project_id and is_nil(c.parent_id)
    )
    |> Repo.all()
  end
end
