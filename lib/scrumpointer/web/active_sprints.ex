defmodule Scrumpointer.Web.ActiveSprints do
  def list([]), do: []

  def list(sprints) do
    Scrumpointer.Web.List.filter_active(sprints)
  end
end
