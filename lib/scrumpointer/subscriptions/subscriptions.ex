defmodule Scrumpointer.Subscriptions do
  def create(user, project, stripe_sub_id) do
    do_create_changeset(user, project, stripe_sub_id)
    |> Scrumpointer.Repo.insert()
  end

  def delete(project) do
    project = Repo.preload(project, :subscription)
    Scrumpointer.Repo.delete(project.subscription)
  end

  def get(project) do
    Scrumpointer.Repo.preload(project, :subscription)
    |> Map.get(:subscription)
  end

  defp do_create_changeset(user, project, stripe_sub_id) do
    Scrumpointer.Subscription.changeset(%Scrumpointer.Subscription{}, %{
      user_id: user.id,
      project_id: project.id,
      stripe_subscription_id: stripe_sub_id
    })
  end
end
