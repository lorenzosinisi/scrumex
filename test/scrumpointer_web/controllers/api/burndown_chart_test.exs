defmodule ScrumpointerWeb.Api.BurndownchartTest do
  use ScrumpointerWeb.ConnCase, async: true
  alias Scrumpointer.Factory

  describe "show/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, project} = Factory.Project.create(%{user_id: user.id})

      {:ok, sprint} =
        Factory.List.create(%{
          user_id: user.id,
          start_date: Timex.now(),
          due_date: Timex.shift(Timex.now(), days: 7),
          project_id: project.id
        })

      Factory.Poll.create(%{
        user_id: user.id,
        list_id: sprint.id,
        project_id: project.id,
        assignee_id: user.id
      })

      {:ok, %{user: user, project: project, sprint: sprint}}
    end

    test "it when the sprint is 7 days long", %{
      conn: conn,
      user: user,
      project: project,
      sprint: sprint
    } do
      conn = assign(conn, :current_user, user)

      conn = get(conn, "/api/projects/#{project.id}/sprints/#{sprint.id}/burndownchart")
      response = json_response(conn, 200)

      assert %{
               "days" => [
                 %{
                   "1" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 },
                 %{
                   "2" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 },
                 %{
                   "3" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 },
                 %{
                   "4" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 },
                 %{
                   "5" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 },
                 %{
                   "6" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 },
                 %{
                   "7" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 }
               ],
               "target" => 0
             } = response
    end

    test "it when the sprint is 3 days long", %{
      conn: conn,
      user: user,
      project: project
    } do
      conn = assign(conn, :current_user, user)

      {:ok, sprint} =
        Factory.List.create(%{
          user_id: user.id,
          name: Ecto.UUID.generate(),
          start_date: Timex.now(),
          due_date: Timex.shift(Timex.now(), days: 3),
          project_id: project.id
        })

      conn = get(conn, "/api/projects/#{project.id}/sprints/#{sprint.id}/burndownchart")
      response = json_response(conn, 200)

      assert %{
               "days" => [
                 %{
                   "1" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 },
                 %{
                   "2" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 },
                 %{
                   "3" => %{
                     "burned" => %{"points" => 0, "stories" => []},
                     "date" => _
                   }
                 }
               ],
               "target" => 0
             } = response
    end
  end
end
