defmodule ScrumpointerWeb.Api.CommentTest do
  use ScrumpointerWeb.ConnCase, async: true
  alias Scrumpointer.Factory

  describe "create/2" do
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

      {:ok, comment} =
        Factory.Comment.create(%{
          parent_id: nil,
          user_id: user.id,
          poll_id: story.id,
          project_id: project.id,
          list_id: sprint.id
        })

      {:ok, %{user: user, comment: comment, sprint: sprint, story: story, project: project}}
    end

    test "it works", %{conn: conn, sprint: sprint, story: story, user: user, project: project} do
      conn = assign(conn, :current_user, user)

      conn =
        post(conn, "/api/projects/#{project.id}/stories/#{story.id}/comments", %{
          body: "something",
          user_id: user.id,
          project_id: project.id,
          poll_id: story.id,
          list_id: sprint.id
        })

      response = json_response(conn, 200)
      sprint_id = sprint.id
      story_id = story.id
      project_id = project.id
      user_id = user.id

      assert %{
               "body" => "something",
               "id" => _,
               "inserted_at" => _,
               "list_id" => ^sprint_id,
               "poll_id" => ^story_id,
               "project_id" => ^project_id,
               "replies" => [],
               "user_id" => ^user_id
             } = response
    end

    test "it can create a reply", %{
      conn: conn,
      sprint: sprint,
      story: story,
      user: user,
      project: project,
      comment: comment
    } do
      conn = assign(conn, :current_user, user)

      conn =
        post(conn, "/api/projects/#{project.id}/stories/#{story.id}/comments", %{
          body: "something",
          user_id: user.id,
          project_id: project.id,
          poll_id: story.id,
          list_id: sprint.id,
          parent_id: comment.id
        })

      response = json_response(conn, 200)
      sprint_id = sprint.id
      story_id = story.id
      project_id = project.id
      user_id = user.id

      assert %{
               "body" => "something",
               "id" => _,
               "inserted_at" => _,
               "list_id" => ^sprint_id,
               "poll_id" => ^story_id,
               "project_id" => ^project_id,
               "replies" => [],
               "user_id" => ^user_id
             } = response
    end
  end

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

      {:ok, comment} =
        Factory.Comment.create(%{
          parent_id: nil,
          user_id: user.id,
          poll_id: story.id,
          project_id: project.id,
          list_id: sprint.id
        })

      {:ok, reply} =
        Factory.Comment.create(%{
          parent_id: comment.id,
          user_id: user.id,
          poll_id: story.id,
          project_id: project.id,
          list_id: sprint.id
        })

      {:ok,
       %{
         user: user,
         reply: reply,
         comment: comment,
         sprint: sprint,
         story: story,
         project: project
       }}
    end

    test "it works listing the comment and the replies", %{
      conn: conn,
      reply: reply,
      sprint: sprint,
      story: story,
      user: user,
      project: project
    } do
      conn = assign(conn, :current_user, user)

      conn = get(conn, "/api/projects/#{project.id}/stories/#{story.id}/comments")

      response = json_response(conn, 200)
      sprint_id = sprint.id
      story_id = story.id
      project_id = project.id
      user_id = user.id
      reply_id = reply.id

      assert [
               %{
                 "body" => "something",
                 "id" => _,
                 "inserted_at" => _,
                 "list_id" => ^sprint_id,
                 "poll_id" => ^story_id,
                 "project_id" => ^project_id,
                 "replies" => [
                   %{
                     "body" => "something",
                     "id" => ^reply_id,
                     "inserted_at" => _,
                     "list_id" => ^sprint_id,
                     "poll_id" => _,
                     "project_id" => ^project_id,
                     "replies" => [],
                     "user_id" => ^user_id
                   }
                 ],
                 "user_id" => ^user_id
               }
             ] = response
    end
  end

  describe "delete/2" do
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

      {:ok, comment} =
        Factory.Comment.create(%{
          parent_id: nil,
          user_id: user.id,
          poll_id: story.id,
          project_id: project.id,
          list_id: sprint.id
        })

      {:ok, reply} =
        Factory.Comment.create(%{
          parent_id: comment.id,
          user_id: user.id,
          poll_id: story.id,
          project_id: project.id,
          list_id: sprint.id
        })

      {:ok,
       %{
         user: user,
         reply: reply,
         comment: comment,
         sprint: sprint,
         story: story,
         project: project
       }}
    end

    test "it deletes the comment", %{
      conn: conn,
      story: story,
      user: user,
      comment: comment,
      project: project
    } do
      conn = assign(conn, :current_user, user)

      conn =
        delete(conn, "/api/projects/#{project.id}/stories/#{story.id}/comments/#{comment.id}")

      response = json_response(conn, 200)

      assert %{"deleted" => true} = response
    end

    test "it deletes the reply", %{
      conn: conn,
      reply: reply,
      story: story,
      user: user,
      project: project
    } do
      conn = assign(conn, :current_user, user)

      conn = delete(conn, "/api/projects/#{project.id}/stories/#{story.id}/comments/#{reply.id}")

      response = json_response(conn, 200)

      assert %{"deleted" => true} = response
    end
  end
end
