defmodule ScrumpointerWeb.Api.RepositoryView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def to_json(repo),
    do: %{
      owner: repo.owner,
      name: repo.name,
      full_name: repo.owner <> "/" <> repo.name,
      id: repo.id,
      data: %{}
    }
end
