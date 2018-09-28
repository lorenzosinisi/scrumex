defmodule Scrumpointer.Factories.StoryWatchersTest do
  use Scrumpointer.DataCase
  alias Scrumpointer.Web.Poll
  alias Scrumpointer.Web.StoryWatchers
  alias Scrumpointer.Factory

  describe "watch/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, project} = Factory.Project.create(%{user_id: user.id})
      {:ok, sprint} = Factory.List.create(%{user_id: user.id, project_id: project.id})

      {:ok, story} =
        Factory.Poll.create(%{
          user_id: user.id,
          list_id: sprint.id,
          project_id: project.id,
          assignee_id: user.id
        })

      {:ok, %{user: user, story: story}}
    end

    test "it works", %{user: user, story: story} do
      {:ok, _watcher} = StoryWatchers.watch(story.id, user.id)

      story =
        Scrumpointer.Repo.get(Poll, story.id)
        |> Scrumpointer.Web.preload([:watchers])

      assert 1 == Enum.count(story.watchers)
    end

    test "does not allow duplicates", %{user: user, story: story} do
      {:ok, %_{id: id}} = StoryWatchers.watch(story.id, user.id)
      assert {:ok, %_{id: ^id}} = StoryWatchers.watch(story.id, user.id)
    end
  end

  describe "unwatch/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, project} = Factory.Project.create(%{user_id: user.id})
      {:ok, sprint} = Factory.List.create(%{user_id: user.id, project_id: project.id})

      {:ok, story} =
        Factory.Poll.create(%{
          user_id: user.id,
          list_id: sprint.id,
          project_id: project.id,
          assignee_id: user.id
        })

      {:ok, %{user: user, story: story}}
    end

    test "it works", %{user: user, story: story} do
      {:ok, _watcher} = StoryWatchers.watch(story.id, user.id)

      story =
        Scrumpointer.Repo.get(Poll, story.id)
        |> Scrumpointer.Web.preload([:watchers])

      assert 1 == Enum.count(story.watchers)

      {:ok, _unwatch} = StoryWatchers.unwatch(story.id, user.id)

      story =
        Scrumpointer.Repo.get(Poll, story.id)
        |> Scrumpointer.Web.preload([:watchers])

      assert 0 == Enum.count(story.watchers)
    end
  end
end
