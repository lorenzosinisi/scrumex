defmodule Scrumpointer.Web.ProjectUsers do
  use Ecto.Schema
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Web.Project

  @primary_key false
  schema "project_users" do
    belongs_to(:user, User)
    belongs_to(:project, Project)

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> Ecto.Changeset.cast(params, [:user_id, :project_id])
    |> Ecto.Changeset.validate_required([:user_id, :project_id])
  end
end
