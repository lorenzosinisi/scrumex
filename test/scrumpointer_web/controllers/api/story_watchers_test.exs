defmodule ScrumpointerWeb.Api.StoryWatchersTest do
  use ScrumpointerWeb.ConnCase, async: true
  alias Scrumpointer.Factory

  describe "watch/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, project} = Factory.Project.create(%{user_id: user.id})

      {:ok, sprint} =
        Factory.List.create(%{
          user_id: user.id,
          project_id: project.id
        })

      {:ok, story} =
        Factory.Poll.create(%{
          user_id: user.id,
          list_id: sprint.id,
          project_id: project.id,
          assignee_id: user.id
        })

      {:ok, %{user: user, story: story, project: project}}
    end

    test "it works", %{conn: conn, story: story, user: user, project: project} do
      conn = assign(conn, :current_user, user)

      conn = post(conn, story_watchers_path(conn, :watch, project.id, story.id))

      assert json_response(conn, 200) == [
               %{
                 "id" => user.id,
                 "name" => user.name
               }
             ]
    end
  end

  describe "unwatch/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, project} = Factory.Project.create(%{user_id: user.id})

      {:ok, sprint} =
        Factory.List.create(%{
          user_id: user.id,
          project_id: project.id
        })

      {:ok, story} =
        Factory.Poll.create(%{
          user_id: user.id,
          list_id: sprint.id,
          project_id: project.id,
          assignee_id: user.id
        })

      {:ok, %{user: user, story: story, project: project}}
    end

    test "it works", %{conn: conn, story: story, user: user, project: project} do
      conn = assign(conn, :current_user, user)
      post(conn, story_watchers_path(conn, :watch, project.id, story.id))

      conn = post(conn, story_watchers_path(conn, :unwatch, project.id, story.id))
      assert json_response(conn, 200) == []
    end

    test "it breaks if the user is not part of the project", %{
      conn: conn,
      story: story,
      project: project,
      user: _user
    } do
      {:ok, another_user} = Factory.User.create()
      conn = assign(conn, :current_user, another_user)

      assert_raise RuntimeError, "Access denied.", fn ->
        post(conn, story_watchers_path(conn, :watch, project.id, story.id))
      end
    end
  end
end
