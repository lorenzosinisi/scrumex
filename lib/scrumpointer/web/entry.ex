defmodule Scrumpointer.Web.Entry do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.{Entry, Poll, Vote}
  alias Scrumpointer.Web

  @primary_key {:id, :binary_id, autogenerate: true}
  @derive {Phoenix.Param, key: :id}

  schema "entries" do
    field(:title, :string)
    field(:votes_count, :integer)
    belongs_to(:poll, Poll, type: :binary_id)
    has_many(:votes, Vote, on_delete: :nilify_all)

    timestamps()
  end

  @doc false
  def changeset(%Entry{} = entry, attrs) do
    entry
    |> cast(attrs, [:title, :votes_count, :poll_id])
    |> validate_required([:title, :poll_id])
  end

  @doc false
  def voters(%Entry{} = entry) do
    # necessary fro Ecto
    # Extract Entry names
    entry
    |> Web.preload(votes: :user)
    |> (& &1.votes).()
    |> Enum.map(fn %{user: user} -> user.name end)
    |> Enum.join(", ")
  end
end
