defmodule Scrumpointer.Web.Team do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.{Team, Poll}

  schema "teams" do
    field(:member_emails, {:array, :string})
    field(:name, :string)
    field(:owner_id, :id)
    has_many(:polls, Poll, on_delete: :nilify_all)

    timestamps()
  end

  @doc false
  def changeset(%Team{} = team, attrs) do
    team
    |> cast(attrs, [:name, :member_emails, :owner_id])
    |> validate_required([:name, :member_emails])
  end
end
