defmodule Scrumpointer.CloseStoryCommandTest do
  use Scrumpointer.DataCase
  import Scrumpointer.CloseStoryCommand

  @valid_arguments ["some_story_id", 12]

  describe "execute/2" do
    test "closes a story and stores an event" do
      defmodule FakePoll do
        def get!(%{poll_id: story_id, project_id: project_id}) do
          %{id: story_id, project_id: project_id, closed: true}
        end

        def close!(story) do
          {:ok, story}
        end
      end

      defmodule FakeEventHandler do
        def execute(_, _), do: nil
      end

      result = execute(@valid_arguments, event_handler: FakeEventHandler, model: FakePoll)

      assert result == {:ok, %{id: "some_story_id", project_id: 12, closed: true}}
    end

    test "closing the story is not possible" do
      defmodule ErrorStory do
        def get!(%{poll_id: story_id, project_id: project_id}) do
          %{id: story_id, project_id: project_id}
        end

        def close!(_story) do
          {:error, "Something went horribly wrong"}
        end
      end

      result = execute(@valid_arguments, model: ErrorStory)

      assert result == {:error, "Something went horribly wrong"}
    end

    test "the arguments are invalid" do
      result = execute([], [])

      assert result ==
               {:error,
                "Invalid params given to the command Scrumpointer.CloseStoryCommand, params given []"}
    end
  end
end
