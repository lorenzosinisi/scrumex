defmodule Scrumpointer.Web.Poll do
  use Ecto.Schema
  import Ecto.Changeset
  alias Scrumpointer.Web.{Poll, Entry, Vote, Team, List, Project, Repository}
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.{Web, Repo}
  alias Scrumpointer.Factories.PointScales
  alias Scrumpointer.Web.Backlog
  import Ecto.Query, warn: false

  @primary_key {:id, :binary_id, autogenerate: true}
  @derive {Phoenix.Param, key: :id}

  schema "polls" do
    field(:closed, :boolean, default: false)
    field(:title, :string)
    field(:scale_type, :string, default: "fibonacci_scale")
    field(:github_number, :string)
    field(:description, :string)
    has_many(:entries, Entry, on_delete: :nilify_all)
    has_many(:votes, Vote, on_delete: :nilify_all)
    belongs_to(:user, User)
    many_to_many(:watchers, User, join_through: "stories_watchers")
    belongs_to(:assignee, User, foreign_key: :assignee_id)
    belongs_to(:project, Project)
    belongs_to(:repository, Repository)
    belongs_to(:team, Team)
    belongs_to(:list, List)
    # Needed for the ordered list
    field(:previous, :decimal, virtual: true)
    field(:next, :decimal, virtual: true)
    field(:next_id, :binary_id, virtual: true)
    field(:previous_id, :binary_id, virtual: true)
    field(:priority, :decimal, default: 0.0)
    # End of fields needed for ordered list

    timestamps()
  end

  @doc false
  def changeset(%Poll{} = poll, attrs) do
    poll
    |> cast(attrs, [
      :title,
      :closed,
      :user_id,
      :list_id,
      :scale_type,
      :project_id,
      :github_number,
      :repository_id,
      :description,
      :assignee_id,
      :priority
    ])
    |> foreign_key_constraint(:list_id)
    |> foreign_key_constraint(:project_id)
    |> validate_required([:title, :closed, :project_id, :list_id, :priority])
  end

  def consensus?(%Poll{} = poll) do
    # necessary fro Ecto
    # Extract votes from Poll
    # Extract Entry ids
    # reduce to single entries
    # Make sure that everybody voted for the same entry
    poll
    |> Web.preload([:votes])
    |> (& &1.votes).()
    |> Enum.map(fn %{entry_id: entry_id} -> entry_id end)
    |> Enum.uniq()
    |> Enum.count()
    |> (&(1 == &1)).()
  end

  @doc false
  def close!(%Poll{} = poll) do
    changeset(poll, %{closed: !poll.closed}) |> Repo.update()
  end

  def create(attrs \\ %{}) do
    %Poll{}
    |> Poll.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Sets a record first in its list by giving it more
    priority than everything esle.

    Example:
      alias Scrumpointer.Web.Poll

      alias Scrumpointer.{Web, Repo}

      first = Repo.get(Poll, "9edffb16-1bb0-4e13-9065-000154520ee4")

      Poll.rank_last(first) # is now the last in the list for priority
  """
  def rank_last(poll) do
    list = by_list_id(poll.list_id)
    %{priority: new_priority} = OrderedList.rank_last(Repo, poll, list)
    Poll.update(poll, %{"priority" => "#{new_priority}"})
  end

  @doc """
    Sets a record last in its list by giving it less
    priority than everything esle.

    Example:
      alias Scrumpointer.Web.Poll

      alias Scrumpointer.{Web, Repo}

      first = Repo.get(Poll, "9edffb16-1bb0-4e13-9065-000154520ee4")

      Poll.rank_last(first) # is now the last in the list for priority
  """
  def rank_first(poll) do
    list = by_list_id(poll.list_id)
    %{priority: new_priority} = OrderedList.rank_first(Repo, poll, list)
    Poll.update(poll, %{"priority" => new_priority})
  end

  @doc """
    Orders the polls in the list by priority
  """
  def ranked(list_id) do
    list = by_list_id(list_id)
    OrderedList.ranked(Repo, list)
  end

  def place_between(%{} = poll, nil, %{} = next_poll) do
    %{priority: new_priority} =
      OrderedList.place_between(poll, nil, next_poll, column_name: 'priority')

    Poll.update(poll, %{"priority" => new_priority})
  end

  def place_between(%{} = poll, %{} = prev_poll, nil) do
    %{priority: new_priority} =
      OrderedList.place_between(poll, prev_poll, nil, column_name: 'priority')

    Poll.update(poll, %{"priority" => new_priority})
  end

  def place_between(%{} = poll, %{} = this, %{} = that) do
    %{priority: new_priority} =
      OrderedList.place_between(poll, this, that, column_name: 'priority')

    Poll.update(poll, %{"priority" => new_priority})
  end

  def create(%User{} = user, %Project{} = project, attrs \\ %{}) do
    %{id: backlog_id} =
      Repo.get_by(
        List,
        project_id: project.id,
        type: List.backlog_name(),
        name: List.backlog_name()
      )
      |> Backlog.find_or_create!(List, project.id, project.user_id)

    last_backlog_story =
      from(p in Poll, where: p.project_id == ^project.id, order_by: [asc: :priority], limit: 1)
      |> Repo.one()

    priority =
      if last_backlog_story == nil do
        0.0
      else
        %Scrumpointer.Web.Poll{} = last_backlog_story
        {decimal, _} = Float.parse(Decimal.to_string(last_backlog_story.priority))
        OrderedList.move(decimal, nil)
      end

    %{
      "scale_type" => scale_type,
      "entries" => entries,
      "repository_id" => _repository_id,
      "description" => _body,
      "title" => _title
    } = attrs

    attrs =
      attrs
      |> Map.put("project_id", project.id)
      |> Map.put("user_id", user.id)
      |> Map.put("list_id", backlog_id)
      |> Map.put("priority", priority)

    Repo.transaction(fn ->
      case Poll.create(attrs) do
        {:ok, poll} ->
          Web.create_poll_entries(poll.id, scale_type, entries)
          poll

        {:error, %Ecto.Changeset{} = changeset} ->
          {:error, changeset}
      end
    end)
  end

  def can_close?(%Poll{} = poll, conn) do
    conn.assigns[:current_user].id == poll.user_id
  end

  def story_points(%Poll{} = poll) do
    number =
      Web.list_votes(poll)
      |> Web.preload([:entry])
      |> Stream.map(fn %{entry: entry} -> entry.title end)
      |> Enum.uniq()
      |> PointScales.biggest(poll)

    number = number || "0"

    {value, _} = Float.parse(number)

    value
  end

  def get!(%{poll_id: id, project_id: project_id}) do
    Repo.get_by!(Poll, id: id, project_id: project_id)
  end

  def delete(%Project{id: project_id}, id) do
    Repo.get_by(Poll, id: id, project_id: project_id)
    |> Repo.delete()
  end

  def by_project(project_id, poll_id), do: get!(%{poll_id: poll_id, project_id: project_id})

  @doc """
   Remove assignee to the Story/Poll
  """
  def assign_to_user(%Poll{} = poll, nil) do
    Poll.update(poll, %{"assignee_id" => nil})
  end

  @doc """
   Add assignee to the Story/Poll
  """
  def assign_to_user(%Poll{} = poll, user_id) do
    %{project: project} = Web.preload(poll, [:project])
    user = Repo.get!(User, user_id)

    if Project.member?(project, user) do
      Poll.update(poll, %{"assignee_id" => user_id})
    else
      {:error, "This user is not a member of the project"}
    end
  end

  def list_all(user, project) do
    case Project.get(%{user: user, user_email: user.email, id: project.id}) do
      %Project{} = project ->
        Repo.all(from(t in Poll, where: t.project_id == ^project.id))

      _ ->
        []
    end
  end

  def by_list_id(id) do
    from(t in Poll, where: t.list_id == ^id)
  end

  def assign_to_sprint(_user, poll, list) do
    Poll.update(poll, %{list_id: list.id})
  end

  def update(poll, attrs \\ %{}) do
    poll
    |> Poll.changeset(attrs)
    |> Repo.update()
  end
end
