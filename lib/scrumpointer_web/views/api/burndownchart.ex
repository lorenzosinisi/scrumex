defmodule ScrumpointerWeb.Api.BurndownchartView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("show.json", %{burndownchart: burndownchart}) do
    to_json(burndownchart)
  end

  def to_json(burndownchart), do: burndownchart
end
