defmodule Scrumpointer.AssignStoryToSprintCommand do
  @doc """
  Closes a sprint and stores the event.
  Accepts arguments like [sprint_id, %Project{}], []
  """
  def execute(params, opts) do
    do_execute(params, opts)
  end

  defp do_execute([user, poll, list], opts) do
    model = Keyword.get(opts, :model, Scrumpointer.Web.Poll)
    event_handler = Keyword.get(opts, :event_handler, Scrumpointer.StoreEventCommand)
    current_list = Scrumpointer.Repo.preload(poll, :list) |> Map.get(:list)

    in_sprint = Scrumpointer.Web.List.sprint?(current_list)

    model.assign_to_sprint(user, poll, list)
    |> case do
      {:ok, poll} ->
        dispatch_event(
          [event_handler, "Poll", poll.id, nil, user.id, list.project_id],
          in_sprint: in_sprint
        )

        {:ok, poll}

      {:error, error} ->
        {:error, error}
    end
  end

  defp dispatch_event(
         [event_handler, name, id, _action, user_id, project_id],
         in_sprint: true
       ) do
    event_handler.execute([name, id, "removed_from_a_sprint", user_id, project_id], [])
  end

  defp dispatch_event(
         [event_handler, name, id, _action, user_id, project_id],
         in_sprint: false
       ) do
    event_handler.execute([name, id, "added_to_a_sprint", user_id, project_id], [])
  end

  defp do_execute(params, _opts) do
    {:error,
     "Invalid params given to the command #{inspect(__MODULE__)}, params given #{inspect(params)}"}
  end
end
