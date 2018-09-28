defmodule ScrumpointerWeb.Api.FeedbackTest do
  use ScrumpointerWeb.ConnCase, async: true
  alias Scrumpointer.Factory

  describe "index/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, project} = Factory.Project.create(%{user_id: user.id})
      {:ok, %{user: user, project: project}}
    end

    test "it works", %{conn: conn, user: user, project: project} do
      conn = assign(conn, :current_user, user)

      conn = get(conn, "/api/projects/#{project.id}/feedback")

      assert json_response(conn, 200) == []
    end
  end
end
