defmodule ScrumpointerWeb.Api.ProjectUsersTest do
  use ScrumpointerWeb.ConnCase, async: false
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

      {:ok,
       %{
         user: user,
         sprint: sprint,
         story: story,
         project: project
       }}
    end

    test "it is initially empty ", %{
      conn: conn,
      user: user,
      project: project
    } do
      conn = assign(conn, :current_user, user)

      conn = get(conn, "/api/projects/#{project.id}/members")

      assert json_response(conn, 200) == %{
               "invitations" => [],
               "users" => []
             }
    end
  end

  describe "add/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, user_b} = Factory.User.create()
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

      {:ok,
       %{
         user: user,
         sprint: sprint,
         user_b: user_b,
         story: story,
         project: project
       }}
    end

    test "it adds the user if exists in our database", %{
      conn: conn,
      user: user,
      user_b: user_b,
      project: project
    } do
      conn = assign(conn, :current_user, user)

      conn = post(conn, "/api/projects/#{project.id}/add_member/#{user_b.email}")

      assert json_response(conn, 200) == %{
               "invitations" => [],
               "users" => [
                 %{
                   "email" => user_b.email,
                   "id" => user_b.id,
                   "name" => user_b.name
                 }
               ]
             }
    end

    test "it adds the user to the list of user_invitations", %{
      conn: conn,
      user: user,
      project: project
    } do
      conn = assign(conn, :current_user, user)

      conn = post(conn, "/api/projects/#{project.id}/add_member/someefemail@gmauhdshx.comedh")

      assert json_response(conn, 200) == %{
               "invitations" => [],
               "users" => []
             }
    end
  end
end
