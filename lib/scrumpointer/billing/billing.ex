defmodule Scrumpointer.Billing do
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Repo
  alias Scrumpointer.Web.Project
  alias Stripe.Customers

  def create_stripe_customer(
        user = %{stripe_customer_id: nil},
        %{
          description: description,
          email: email,
          metadata: %{user_id: user_id, source: endpoint},
          source: source_token
        } = attrs
      ) do
    Customers.create(attrs)
    |> case do
      {:ok, stripe_customer = %{id: stripe_customer_id}} ->
        User.stripe_changeset(user, %{stripe_customer_id: stripe_customer_id})
        |> Repo.update()

      {:error, error} ->
        {:error, error}
    end
  end

  def create_stripe_customer(user = %{stripe_customer_id: stripe_customer_id}, attrs)
      when is_binary(stripe_customer_id) do
    {:ok, user}
  end

  def subscribe_customer_to_stripe_plan(user, project, plan_id) do
    # add the tax_percentage, vat here as an extra attribute if needed
    user = Scrumpointer.Repo.get(User, user.id)

    project =
      Scrumpointer.Repo.get(Project, project.id)
      |> Scrumpointer.Repo.preload(:subscription)

    do_subscribe_customer_to_stripe_plan(user, project, plan_id)
  end

  defp do_subscribe_customer_to_stripe_plan(
         user = %{stripe_customer_id: stripe_customer},
         project,
         plan_id
       )
       when is_binary(stripe_customer) do
    if project.subscription == nil do
      {:ok, %{id: stripe_subscription_id}} =
        Stripe.Subscriptions.create(
          stripe_customer,
          plan: plan_id,
          metadata: %{project_id: project.id}
        )

      Scrumpointer.Subscriptions.create(user, project, stripe_subscription_id)
    else
      {:ok, project}
    end
  end

  defp do_subscribe_customer_to_stripe_plan(
         %{stripe_customer_id: nil},
         _,
         _
       ) do
    {:error, "The user must be a Stripe customer first"}
  end

  defp do_subscribe_customer_to_stripe_plan(_, _, _) do
    {:error, "Stripe error unknown"}
  end

  def delete_subscription(user, project, subscription_id) do
    project = Scrumpointer.Repo.preload(project, :subscription)
    subscription = project.subscription

    {:ok, _} =
      Stripe.Subscription.cancel(
        user.stripe_customer_id,
        subscription.stripe_subscription_id
      )

    Scrumpointer.Subscriptions.delete(project)
  end
end
