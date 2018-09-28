defmodule ScrumpointerWeb.Api.Account do
  use ScrumpointerWeb, :controller

  def show(%{assigns: %{current_user: user}} = conn, _params) do
    render(conn, "show.json", user: user)
  end

  def delete(%{assigns: %{current_user: user}} = conn, _params) do
    Scrumpointer.Repo.delete!(user)
    render(conn, "delete.json", %{})
  end
end
