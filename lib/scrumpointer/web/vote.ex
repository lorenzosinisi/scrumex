defmodule Scrumpointer.Web.Vote do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.{Vote, Poll, Entry, Team}
  alias Scrumpointer.Coherence.User

  schema "votes" do
    field(:value, :integer)
    belongs_to(:user, User)
    belongs_to(:poll, Poll, type: :binary_id)
    belongs_to(:entry, Entry, type: :binary_id)
    belongs_to(:team, Team)

    timestamps()
  end

  @doc false
  def changeset(%Vote{} = vote, attrs) do
    vote
    |> cast(attrs, [:value, :user_id, :poll_id, :entry_id, :team_id])
  end
end
