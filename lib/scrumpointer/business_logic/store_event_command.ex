defmodule Scrumpointer.StoreEventCommand do
  def execute([name, resource_id, action, user_id, project_id], opts \\ []) do
    event_model = Keyword.get(opts, :model, Scrumpointer.Web.Event)
    repo = Keyword.get(opts, :model, Scrumpointer.Repo)

    event_model
    |> struct()
    |> event_model.changeset(%{
      "resource_id" => to_string(resource_id),
      "name" => to_string(name),
      "action" => to_string(action),
      "user_id" => to_string(user_id),
      "project_id" => project_id
    })
    |> repo.insert()
  end
end
