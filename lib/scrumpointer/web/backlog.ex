defmodule Scrumpointer.Web.Backlog do
  alias Scrumpointer.Repo

  def by_project(project) do
    backlog =
      Scrumpointer.Repo.get_by(Scrumpointer.Web.List, project_id: project.id, type: "backlog")

    (backlog && Scrumpointer.Web.Poll.ranked(backlog.id)) || []
  end

  def find_or_create!(list, model, project_id, user_id) do
    create(list, model, project_id, user_id)
  end

  defp create(%{} = list, _, _, _), do: list

  defp create(nil, model, project_id, user_id) do
    {:ok, backlog} =
      model.__struct__
      |> model.changeset(%{
        project_id: project_id,
        type: model.backlog_name(),
        name: model.backlog_name(),
        user_id: user_id
      })
      |> Repo.insert()

    backlog
  end
end
