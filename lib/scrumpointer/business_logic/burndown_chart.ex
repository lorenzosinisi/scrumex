defmodule Scrumpointer.BurndownChart do
  alias Scrumpointer.Web
  use Timex
  import Ecto.Query, only: [from: 2]

  def execute(params) do
    do_execute(params)
  end

  defp do_execute([project_id, list_id]) do
    list = Web.List.get(%Web.Project{id: project_id}, list_id)
    sprint = Scrumpointer.Web.preload(list, [:polls])
    total_story_points = Scrumpointer.Web.List.story_points(sprint)
    list_duration = duration(list.start_date, list.due_date)
    days = %{}

    days =
      Enum.map(1..list_duration, fn day ->
        previous_date = Timex.shift(list.start_date, days: day - 1)
        current_date = Timex.shift(list.start_date, days: day)

        Map.merge(days, %{
          day => %{
            date: current_date,
            burned: burned(list_id, previous_date, current_date)
          }
        })
      end)

    %{target: total_story_points, days: days}

    # [
    #   %{1 => %{burned: 0, date: #DateTime<2018-01-20 00:00:00.000000Z>}},
    #   %{2 => %{burned: 0, date: #DateTime<2018-01-21 00:00:00.000000Z>}},
    #   %{3 => %{burned: 0, date: #DateTime<2018-01-22 00:00:00.000000Z>}},
    #   %{4 => %{burned: 0, date: #DateTime<2018-01-23 00:00:00.000000Z>}}
    # ]
  end

  defp burned(list_id, previous_date = %DateTime{}, date = %DateTime{}) do
    {:ok, date} = Ecto.Date.cast(date)
    {:ok, previous_date} = Ecto.Date.cast(previous_date)

    closed_ids =
      from(
        poll in Web.Poll,
        where: poll.closed == true and poll.list_id == ^list_id,
        select: poll.id
      )
      |> Scrumpointer.Repo.all()

    events =
      from(
        e in Web.Event,
        where:
          fragment("?::date", e.inserted_at) < ^date and
            fragment("?::date", e.inserted_at) >= ^previous_date and e.resource_id in ^closed_ids,
        select: e.resource_id
      )

    burned = Scrumpointer.Repo.all(events)

    story_points =
      from(story in Web.Poll, where: story.id in ^burned)
      |> Scrumpointer.Repo.all()
      |> Enum.map(&Web.Poll.story_points/1)
      |> Enum.sum()

    %{stories: burned, points: story_points}
  end

  defp do_execute(anything) do
    {:error, "Invalid params #{inspect(anything)}"}
  end

  defp duration(%DateTime{} = start_date, %DateTime{} = due_date) do
    due_date |> Timex.diff(start_date, :days)
  end

  defp duration(_, _) do
    {:error, "Invalid dates"}
  end
end
