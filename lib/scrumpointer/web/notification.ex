defmodule Scrumpointer.Web.Notification do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query, warn: false
  alias Scrumpointer.Repo
  alias Scrumpointer.Web
  alias Scrumpointer.Coherence.User
  alias ScrumpointerWeb.Coherence.UserEmail
  alias ScrumpointerWeb.Coherence.Mailer

  schema "notifications" do
    field(:action, :string)
    field(:resource_type, :string)
    belongs_to(:user, User, type: :id)
    belongs_to(:creator, User, type: :id)

    timestamps()
  end

  @doc false
  def changeset(%{} = notification, attrs) do
    notification
    |> cast(attrs, [:action, :resource_type, :user_id, :creator_id])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:creator_id)
    |> validate_required([:creator_id, :user_id, :action, :resource_type])
  end

  def create(attrs \\ %{}) do
    %__MODULE__{}
    |> changeset(attrs)
    |> Repo.insert()
  end

  def notify(watcher, %Web.Comment{} = comment, action) do
    comment = Scrumpointer.Repo.preload(comment, [:poll, :list, :project])

    commenter = Scrumpointer.Repo.get(User, comment.user_id)

    create(%{
      user_id: watcher.id,
      creator_id: comment.user_id,
      action: "#{action}",
      resource_type: "comment"
    })
    |> case do
      {:ok, _} ->
        Task.async(fn ->
          Scrumpointer.Repo.get(User, watcher.id)
          |> UserEmail.new_comment(comment, commenter)
          |> Mailer.deliver()
        end)

      true ->
        {:error, "could not create a notification"}
    end
  end

  def notify(watcher, resource, action) do
    {:ok, [watcher, resource, action]}
  end
end
