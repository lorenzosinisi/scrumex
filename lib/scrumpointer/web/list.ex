defmodule Scrumpointer.Web.List do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.{List, Poll, Project}
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Repo
  import Ecto.Query, warn: false
  use Timex

  schema "lists" do
    field(:duration, :integer, default: 1)
    field(:name, :string)
    field(:points, :integer)
    field(:type, :string)
    field(:team_id, :id)
    field(:start_date, :utc_datetime)
    field(:due_date, :utc_datetime)
    field(:closed, :boolean)
    belongs_to(:project, Project)
    belongs_to(:user, User)
    has_many(:polls, Poll, on_delete: :nilify_all)

    timestamps()
  end

  @backlog_name "backlog"

  def backlog_name, do: @backlog_name

  @doc false
  def changeset(%List{} = list, attrs) do
    list
    |> cast(attrs, [
      :name,
      :type,
      :duration,
      :user_id,
      :project_id,
      :start_date,
      :due_date,
      :closed
    ])
    |> validate_required([:name, :type, :user_id, :project_id])
  end

  def story_points(%{polls: polls}) do
    points =
      Enum.reduce(polls, 0, fn poll, acc ->
        Poll.story_points(poll) + acc
      end)

    (points > 0 && points) || 0
  end

  @doc """
   Used by APIs only and it should stay like that
  """
  def create(%User{} = user, %Project{} = project, list_params) do
    list_params =
      list_params
      |> Map.put("project_id", project.id)
      |> Map.put("type", "sprint")
      |> Map.put("user_id", user.id)

    create(list_params)
  end

  def create(attrs \\ %{}) do
    %List{}
    |> List.changeset(attrs)
    |> Repo.insert()
  end

  def update(list, attrs \\ %{}) do
    list
    |> List.changeset(attrs)
    |> Repo.update()
  end

  def get(%Project{id: project_id}, id) do
    Repo.get_by(List, id: id, project_id: project_id)
  end

  @doc """
    Given a project and an id will reverse the attribute
    closed of the list
  """
  def close!(project, id) do
    list = Repo.get_by!(List, id: id, project_id: project.id)

    list
    |> changeset(%{closed: !list.closed})
    |> Repo.update()
  end

  def get!(id), do: Repo.get!(List, id)

  def delete(%Project{id: project_id} = _project, id) do
    Repo.transaction(fn ->
      list = Repo.get_by(List, id: id, project_id: project_id)

      %{id: backlog_id} =
        Scrumpointer.Repo.get_by(Scrumpointer.Web.List, project_id: project_id, type: "backlog")

      Repo.update_all(
        from(poll in Poll, where: poll.project_id == ^project_id and poll.list_id == ^id),
        set: [list_id: backlog_id]
      )

      Repo.delete(list)
    end)
  end

  def active?(
        %_{
          start_date: %DateTime{} = start_date,
          due_date: %DateTime{} = due_date,
          closed: closed,
          type: "sprint"
        } = _list
      )
      when closed != true do
    Timex.between?(Timex.now(), start_date, due_date)
  end

  def active?(_) do
    false
  end

  def sprint?(%_{type: "sprint"} = _list) do
    true
  end

  def sprint?(_) do
    false
  end

  def filter_active(lists) do
    Enum.filter(lists, fn list ->
      list.type == "sprint" && list.closed != true
    end)
  end

  def by_project(project) do
    Repo.all(from(l in List, where: l.project_id == ^project.id and l.type != "backlog"))
  end
end
