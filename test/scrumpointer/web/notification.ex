defmodule Scrumpointer.Web.NotificationTest do
  use Scrumpointer.DataCase
  alias Scrumpointer.Web.Comment
  alias Scrumpointer.Web.Notification
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Factory

  describe "notify/3" do
    setup do
      {:ok, user}    = Factory.User.create
      {:ok, project} = Factory.Project.create(%{user_id: user.id})
      {:ok, sprint}    = Factory.List.create(%{user_id: user.id, project_id: project.id})
      {:ok, story}   = Factory.Poll.create(
        %{
          user_id: user.id,
          list_id: sprint.id,
          project_id: project.id,
          assignee_id: user.id
        }
      )
      {:ok, comment} = Factory.Comment.create()

      {:ok, %{user: user, comment: comment}}
    end

    test "it works", %{user: user, comment: comment} do
      user_id = user.id
      resource_type = "comment"
      creator_id = comment.user_id
      action = "created"

      assert {
        :ok,
        %Notification{
          user_id: ^user_id,
          resource_type: ^resource_type,
          creator_id: ^creator_id,
          action: ^action
        }
      } = Notification.notify(watcher, comment, "created")
    end
  end
 end
