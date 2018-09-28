defmodule ScrumpointerWeb.Api.AccountView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("show.json", %{user: user}) do
    user |> to_json()
  end

  def render("delete.json", %{}) do
    %{ok: "deleted"}
  end

  def to_json(user) do
    %{
      email: user.email,
      name: user.name
    }
  end
end
