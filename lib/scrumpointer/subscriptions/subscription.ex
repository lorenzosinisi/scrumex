defmodule Scrumpointer.Subscription do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.Project
  alias Scrumpointer.Coherence.User

  schema "subscriptions" do
    belongs_to(:user, User, type: :id)
    belongs_to(:project, Project, type: :id)
    field(:uuid, :string)
    field(:stripe_subscription_id, :string)
    timestamps()
  end

  @doc false
  def changeset(subscription, attrs) do
    attrs = Dict.put(attrs, :uuid, Ecto.UUID.generate())

    subscription
    |> cast(attrs, [:user_id, :project_id, :stripe_subscription_id, :uuid])
    |> validate_required([:user_id, :project_id, :stripe_subscription_id])
  end
end
