defmodule Scrumpointer.Web.Repository do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.{Repository}
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Repo

  schema "repositories" do
    field(:github_id, :integer)
    field(:name, :string)
    field(:owner, :string)
    field(:project_id, :id)
    belongs_to(:user, User)

    timestamps()
  end

  @doc false
  def changeset(%Repository{} = repository, attrs) do
    repository
    |> cast(attrs, [:name, :owner, :project_id])
    |> validate_required([:name, :owner, :project_id])
  end

  @doc false
  def create(project, attrs \\ %{}) do
    %Repository{project_id: project.id}
    |> Repository.changeset(attrs)
    |> Repo.insert()
  end
end
