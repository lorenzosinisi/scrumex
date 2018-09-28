defmodule Scrumpointer.Web.StoryWatchers do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Repo
  import Ecto.Query, warn: false
  alias Scrumpointer.Web.Poll
  alias Scrumpointer.Coherence.User

  schema "stories_watchers" do
    belongs_to(:poll, Poll, type: :binary_id)
    belongs_to(:user, User)
  end

  @doc false
  def changeset(%__MODULE__{} = watchers, attrs) do
    watchers
    |> cast(attrs, [:poll_id, :user_id])
    |> foreign_key_constraint(:poll_id)
    |> foreign_key_constraint(:user_id)
  end

  def get(poll_id, user_id) do
    Repo.get_by(Scrumpointer.Web.StoryWatchers, poll_id: poll_id, user_id: user_id)
    |> Repo.preload([:poll, :user])
  end

  def watch(poll_id, user_id) do
    case get(poll_id, user_id) do
      nil -> create(%{poll_id: poll_id, user_id: user_id})
      watcher -> {:ok, watcher}
    end
  end

  def unwatch(poll_id, user_id) do
    delete(%{poll_id: poll_id, user_id: user_id})
  end

  defp create(attrs) do
    changeset(%__MODULE__{}, attrs)
    |> Repo.insert()
  end

  defp delete(attrs) do
    Repo.get_by!(__MODULE__, poll_id: attrs.poll_id, user_id: attrs.user_id)
    |> Repo.delete()
  end
end
