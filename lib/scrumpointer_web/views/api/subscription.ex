defmodule ScrumpointerWeb.Api.SubscriptionView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("show.json", %{subscription: nil}) do
    nil
  end

  def render("show.json", %{subscription: subscription}) do
    to_json(subscription)
  end

  def to_json(%{id: id} = subscription) do
    %{
      status: :active
    }
  end
end
