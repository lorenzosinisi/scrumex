defmodule Scrumpointer.Billing do
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Repo
  alias Stripe.Customer

  def create_stripe_customer(
        user = %{stripe_customer_id: nil},
        %{
          description: description,
          email: email,
          metadata: %{user_id: user_id, source: endpoint},
          source: source_token
        } = attrs
      ) do
    Customer.create(attrs)
    |> case do
      {:ok, stripe_customer = %{id: stripe_customer_id}} ->
        User.stripe_changeset(%{stripe_customer_id: stripe_customer_id})
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
    {:ok, %{id: stripe_subscription_id}} =
      Stripe.Subscription.create(user.stripe_customer_id, plan: plan_id)

    Scrumpointer.Subscriptions.create(user, project, stripe_subscription_id)
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
