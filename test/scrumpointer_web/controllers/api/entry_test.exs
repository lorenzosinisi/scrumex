defmodule ScrumpointerWeb.Api.EntryTest do
  use ScrumpointerWeb.ConnCase, async: true
  alias Scrumpointer.Factory

  describe "index/2" do
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

      conn = get(conn, "/api/projects/#{project.id}/issues/#{story.id}/entries")

      assert json_response(conn, 200) == []
    end
  end
end
