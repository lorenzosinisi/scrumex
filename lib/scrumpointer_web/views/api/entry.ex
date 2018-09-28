defmodule ScrumpointerWeb.Api.EntryView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("index.json", %{entries: entries}) do
    Enum.sort(entries, &(&1.inserted_at <= &2.inserted_at))
    |> Enum.map(&to_json/1)
  end

  def to_ordered_json(entries) do
    Enum.sort(entries, &(&1.inserted_at <= &2.inserted_at))
    |> Enum.map(&to_json/1)
  end

  def to_json(entry),
    do: %{
      id: entry.id,
      title: entry.title,
      poll_id: entry.poll_id
    }
end
