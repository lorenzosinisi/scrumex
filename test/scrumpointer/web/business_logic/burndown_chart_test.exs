defmodule Scrumpointer.BurndownChartTest do
  use Scrumpointer.DataCase
  alias Scrumpointer.Factory
  import Scrumpointer.BurndownChart

  describe "execute/1" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, project} = Factory.Project.create(%{user_id: user.id})

      {:ok, sprint} =
        Factory.List.create(%{
          user_id: user.id,
          project_id: project.id,
          start_date: Timex.shift(Timex.today(), days: -2) |> Timex.format!("%FT%T%:z", :strftime),
          due_date: Timex.shift(Timex.today(), days: 2) |> Timex.format!("%FT%T%:z", :strftime)
        })

      {:ok, story} =
        Factory.Poll.create(%{
          user_id: user.id,
          list_id: sprint.id,
          project_id: project.id,
          assignee_id: user.id
        })

      {:ok, story} = Scrumpointer.BusinessLogic.close_story([story.id, project.id], [])

      {:ok, %{story: story, project: project, sprint: sprint}}
    end

    test "it returns the matrix including one story closed on day 1", %{
      project: project,
      sprint: sprint,
      story: story
    } do
      expected_story_id = story.id

      assert %{
               days: [
                 %{1 => %{burned: %{points: 0, stories: []}, date: _}},
                 %{2 => %{burned: %{points: 0, stories: []}, date: _}},
                 %{3 => %{burned: %{points: 0.0, stories: [^expected_story_id]}, date: _}},
                 %{4 => %{burned: %{points: 0, stories: []}, date: _}}
               ],
               target: 0
             } = execute([project.id(), sprint.id()])
    end
  end
end
