defmodule ScrumpointerWeb.Api.StoryWatchersView do
  @moduledoc false

  use ScrumpointerWeb, :view

  def render("index.json", %{watchers: watchers}) do
    Enum.map(watchers, &to_json/1)
  end

  def to_json(watcher) do
    %{
      id: watcher.id,
      name: watcher.name
    }
  end
end
