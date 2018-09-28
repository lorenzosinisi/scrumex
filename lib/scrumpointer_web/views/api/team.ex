defmodule ScrumpointerWeb.Api.TeamView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("index.json", %{team: team}) do
    Enum.map(team, &to_json/1)
  end

  def to_json(member),
    do: %{
      id: member.id,
      email: member.email,
      name: member.name
    }
end
