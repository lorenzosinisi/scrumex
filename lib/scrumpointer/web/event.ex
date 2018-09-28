defmodule Scrumpointer.Web.Event do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.Event

  schema "events" do
    field(:action, :string)
    field(:name, :string)
    field(:user_id, :string)
    field(:resource_id, :string)
    field(:project_id, :id)

    timestamps()
  end

  @doc false
  def changeset(%Event{} = event, attrs) do
    event
    |> cast(attrs, [:project_id, :name, :action, :user_id, :resource_id])
    |> validate_required([:name, :action, :resource_id, :project_id])
  end
end
