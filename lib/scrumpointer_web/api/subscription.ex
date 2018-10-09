defmodule ScrumpointerWeb.Api.Subscription do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User

  plug(:set_project!)
  plug(:restrict_to_owner!)

  def show(%{assigns: %{current_user: _user, project: project}} = conn, _params) do
    render(
      conn,
      "show.json",
      subscription: Scrumpointer.Subscriptions.get(project)
    )
  end

  def create(%{assigns: %{current_user: user, project: project}} = conn, %{
        "token" => %{"id" => source}
      }) do
    {:ok, user} =
      Scrumpointer.Billing.create_stripe_customer(user, %{
        description: "Standard Subscription",
        email: user.email,
        metadata: %{user_id: user.id, source: "ScrumpointerWeb.Api.Subscription.create"},
        source: source
      })

    {:ok, _} =
      Scrumpointer.Billing.subscribe_customer_to_stripe_plan(user, project, get_plan_id())

    render(
      conn,
      "show.json",
      subscription: Scrumpointer.Subscriptions.get(project)
    )
  end

  def delete(%{assigns: %{current_user: user, project: project}} = conn, params) do
    subscription = Scrumpointer.Repo.preload(project, :subscription) |> Map.get(:subscription)

    {:ok, _} =
      Scrumpointer.Subscriptions.delete_subscription(
        user,
        project,
        subscription.stripe_subscription_id
      )

    render(
      conn,
      "show.json",
      subscription: Scrumpointer.Subscriptions.get(project)
    )
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    assign(conn, :project, project)
  end

  defp get_plan_id() do
    System.get_env("STRIPE_PLAN_ID")
  end

  defp restrict_to_owner!(%{assigns: %{current_user: user}} = conn, _) do
    is_owner =
      Scrumpointer.Web.Project.get(conn.params["project_id"])
      |> Scrumpointer.Web.Project.owner?(user)

    if is_owner do
      conn
    else
      halt(conn)
    end
  end
end
