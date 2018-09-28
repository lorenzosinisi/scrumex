defmodule Scrumpointer.CloseSprintCommand do
  @doc """
  Closes a sprint and stores the event.
  Accepts arguments like [sprint_id, %Project{}], []
  """
  def execute(params, opts) do
    do_execute(params, opts)
  end

  defp do_execute([sprint_id, project, user], opts) when is_binary(sprint_id) do
    model = Keyword.get(opts, :model, Scrumpointer.Web.List)
    event_handler = Keyword.get(opts, :event_handler, Scrumpointer.StoreEventCommand)

    stories =
      Scrumpointer.Repo.get(model, sprint_id) |> Scrumpointer.Repo.preload(:polls)
      |> Map.get(:polls)

    all_done = Enum.all?(stories, fn story -> story.closed end)

    model.close!(project, sprint_id)
    |> case do
      {:ok, sprint} ->
        status = if sprint.closed, do: "closed", else: "opened"

        dispatch_event(
          [event_handler, "List", sprint.id, status, user.id, project.id],
          closed: sprint.closed,
          all_done: all_done
        )

        {:ok, sprint}

      {:error, error} ->
        {:error, error}
    end
  end

  defp dispatch_event(
         [event_handler, name, id, _action, user_id, project_id],
         closed: true,
         all_done: true
       ) do
    event_handler.execute([name, id, "closed", user_id, project_id], [])
    event_handler.execute([name, id, "closed_with_all_stories_done", user_id, project_id], [])
  end

  defp dispatch_event(
         [event_handler, name, id, _action, user_id, project_id],
         closed: true,
         all_done: false
       ) do
    event_handler.execute([name, id, "closed", user_id, project_id], [])
    event_handler.execute([name, id, "closed_with_open_stories", user_id, project_id], [])
  end

  defp dispatch_event(
         [event_handler, name, id, _action, user_id, project_id],
         closed: false,
         all_done: _
       ) do
    event_handler.execute([name, id, "reopened", user_id, project_id], [])
  end

  defp do_execute(params, _opts) do
    {:error,
     "Invalid params given to the command #{inspect(__MODULE__)}, params given #{inspect(params)}"}
  end
end
