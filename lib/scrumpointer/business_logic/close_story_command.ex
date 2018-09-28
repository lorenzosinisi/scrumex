defmodule Scrumpointer.CloseStoryCommand do
  @doc """
  Closes a story and stores the event.
  Accepts arguments like [story_id, project_id], []
  """
  def execute(params, opts) do
    do_execute(params, opts)
  end

  defp do_execute([story_id, project_id], opts)
       when is_binary(story_id) and is_number(project_id) do
    model = Keyword.get(opts, :model, Scrumpointer.Web.Poll)
    event_handler = Keyword.get(opts, :event_handler, Scrumpointer.StoreEventCommand)

    model.get!(%{poll_id: story_id, project_id: project_id})
    |> model.close!()
    |> case do
      {:ok, story} ->
        status = if story.closed, do: "closed", else: "opened"
        dispatch_event([event_handler, "story", story.id, status, nil, project_id], [])
        {:ok, story}

      {:error, error} ->
        {:error, error}
    end
  end

  defp do_execute(params, _opts) do
    {:error,
     "Invalid params given to the command #{inspect(__MODULE__)}, params given #{inspect(params)}"}
  end

  defp dispatch_event([event_handler, name, id, action, user_id, project_id], []) do
    event_handler.execute([name, id, action, user_id, project_id], [])
  end
end
