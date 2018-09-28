defmodule Scrumpointer.BusinessLogic do
  @moduledoc """
  This module is used as proxy to dispatch calls to other parts
  of the application.
  """
  alias Scrumpointer.Web
  import Ecto.Query, warn: false
  @comment_mentioned_team_members ~r/(?:@\[(.*?)\]\((.*?)\))/

  alias Scrumpointer.{
    Web,
    BurndownChart,
    CloseStoryCommand,
    CloseSprintCommand,
    AssignStoryToSprintCommand,
    UpdateAStoryCommand
  }

  @doc "Create a comment on a Story"
  def create_comment(params, opts \\ []) do
    command(:create_comment, [params, opts])
  end

  @doc "Close a story"
  def close_story(params, opts \\ []) do
    command(:close_story, [params, opts])
  end

  @doc "Assign a story to a sprint"
  def assign_story_to_sprint(params, opts \\ []) do
    command(:assign_story_to_sprint, [params, opts])
  end

  @doc "Update a story command, params: [story, list_id, title, description, user_id], opts: []"
  def update_a_story(params, opts \\ []) do
    command(:update_a_story, [params, opts])
  end

  def close_sprint(params, opts \\ []) do
    command(:close_sprint, [params, opts])
  end

  @doc "Create a map with data about the burndown data of a given list"
  def get_burndown_chart(project_id, list_id, opts \\ []) do
    command(:get_burndown_chart, [project_id, list_id, opts])
  end

  # ACTUAL LOGIC #
  defp command(action_name, params) do
    dispatch(action_name, params)
    |> notify_watchers(action_name)
  end

  defp notify_watchers({:ok, %Scrumpointer.Web.Comment{parent_id: nil} = comment}, action_name) do
    notifications =
      Scrumpointer.Web.preload(comment, poll: :watchers)
      |> Map.get(:poll)
      |> Map.get(:watchers)
      |> Enum.map(fn watcher ->
        notify(watcher, comment, action_name)
      end)

    ok(comment)
  end

  defp notify_watchers(
         {:ok, %Scrumpointer.Web.Comment{parent_id: parent_id} = comment},
         action_name
       )
       when is_binary(parent_id) do
    watchers =
      Scrumpointer.Web.preload(comment, poll: :watchers)
      |> Map.get(:poll)
      |> Map.get(:watchers)

    parent =
      Scrumpointer.Web.preload(comment, :parent)
      |> Map.get(:parent)

    replies =
      Scrumpointer.Web.preload(parent, :replies)
      |> Map.get(:replies)

    ids_people_in_conversation =
      Enum.map(replies, fn reply ->
        reply.user_id
      end)

    ids_watchers =
      Enum.map(watchers, fn watcher ->
        watcher.id
      end)

    users =
      Enum.uniq(ids_watchers ++ ids_people_in_conversation ++ [parent.user_id]) --
        [comment.user_id]

    people_in_conversation =
      Scrumpointer.Repo.all(from(user in Scrumpointer.Coherence.User, where: user.id in ^users))

    Enum.each(people_in_conversation, fn user ->
      notify(user, comment, action_name)
    end)

    ok(comment)
  end

  defp notify_watchers(result, _action_name) do
    result
  end

  defp notify(watcher, resource, action_name) do
    Scrumpointer.Web.Notification.notify(watcher, resource, action_name)
  end

  defp dispatch(:create_comment, [params, opts]) do
    handler = Keyword.get(opts, :handler, Web.Comment)

    handler.create(params)
    |> case do
      {:ok, comment} ->
        Regex.scan(@comment_mentioned_team_members, "#{comment.body}")
        |> Enum.map(fn [_, _, user_id] ->
          Scrumpointer.Web.StoryWatchers.watch(comment.poll_id, user_id)
        end)

        {:ok, comment}

      otherwise ->
        otherwise
    end
  end

  defp dispatch(:close_story, [params, opts]) do
    handler = Keyword.get(opts, :handler, CloseStoryCommand)
    handler.execute(params, opts)
  end

  defp dispatch(:assign_story_to_sprint, [params, opts]) do
    handler = Keyword.get(opts, :handler, AssignStoryToSprintCommand)
    handler.execute(params, opts)
  end

  defp dispatch(:update_a_story, [params, opts]) do
    handler = Keyword.get(opts, :handler, UpdateAStoryCommand)
    handler.execute(params, opts)
  end

  defp dispatch(:close_sprint, [params, opts]) do
    handler = Keyword.get(opts, :handler, CloseSprintCommand)
    handler.execute(params, opts)
  end

  defp dispatch(:get_burndown_chart, [project_id, list_id, opts]) do
    get_handler(opts, BurndownChart)
    |> execute([project_id, list_id])
  end

  defp dispatch(command_name, _params) do
    {:error, :not_implemented, command_name}
  end

  defp execute(handler, params) do
    List.wrap(params)
    |> handler.execute()
  end

  defp get_handler(opts, default), do: Keyword.get(opts, :handler, default)
  defp ok(value), do: {:ok, value}
  defp error(value), do: {:error, value}
end
