defmodule Scrumpointer.Coherence.User do
  @moduledoc false
  use Ecto.Schema
  use Coherence.Schema

  use Timex

  alias Scrumpointer.Web.{
    Team,
    Poll,
    Vote,
    List,
    Comment,
    Notification,
    AttachmentUpload
  }

  schema "users" do
    field(:name, :string)
    field(:email, :string)
    field(:token, :string)
    field(:provider, :string)
    field(:github_data, :binary)
    field(:github_id, :string)
    field(:terms_accepted_at, Ecto.DateTime)
    field(:admin, :boolean)
    has_many(:teams, Team, on_delete: :nilify_all, foreign_key: :owner_id)
    has_many(:polls, Poll, on_delete: :nilify_all)
    has_many(:votes, Vote, on_delete: :nilify_all)
    has_many(:lists, List, on_delete: :nilify_all)
    has_many(:comments, Comment, on_delete: :nilify_all)
    has_many(:notifications, Notification, on_delete: :nilify_all)
    has_many(:attachment_uploads, AttachmentUpload, on_delete: :nilify_all)

    has_many(:assigned_stories, Poll, on_delete: :nilify_all, foreign_key: :assignee_id)

    has_many(
      :created_projects,
      Scrumpointer.Web.Project,
      on_delete: :nilify_all
    )

    many_to_many(
      :projects,
      Scrumpointer.Web.Project,
      join_through: Scrumpointer.Web.ProjectUsers,
      on_delete: :delete_all
    )

    coherence_schema()

    timestamps()
  end

  def changeset(model, params \\ %{}) do
    case is_binary(model.email) do
      false ->
        params = convert_terms_accepted_at(model, params)

        model
        |> cast(
          params,
          [:name, :email, :token, :provider, :github_data, :github_id, :terms_accepted_at] ++
            coherence_fields()
        )
        |> validate_required([:email, :terms_accepted_at])
        |> validate_format(:email, ~r/@/)
        |> unique_constraint(:email)
        |> validate_coherence(params)

      true ->
        model
        |> cast(
          params,
          [:name, :token, :provider, :github_data, :github_id] ++ coherence_fields()
        )
        |> validate_coherence(params)
    end
  end

  def stripe_changeset(model, params \\ %{}) do
    model
    |> cast(params, [:stripe_customer_id])
  end

  def convert_terms_accepted_at(_model, params) do
    terms_accepted_at = get_in(params, ["terms_accepted_at"])

    case terms_accepted_at do
      nil ->
        params

      _ ->
        Timex.parse(terms_accepted_at, "{ISO:Extended}")
        |> case do
          {:ok, time} -> Map.merge(params, %{"terms_accepted_at" => time})
          _ -> params
        end
    end
  end

  def changeset(model, params, :password) do
    model
    |> cast(
      params,
      ~w(password password_confirmation reset_password_token reset_password_sent_at)
    )
    |> validate_coherence_password_reset(params)
  end

  def find(id) do
    Scrumpointer.Repo.get(__MODULE__, id)
  end

  def get!(id) do
    Scrumpointer.Repo.get!(__MODULE__, id)
  end

  def should_see_update?(_message, _user) do
    true
  end
end
