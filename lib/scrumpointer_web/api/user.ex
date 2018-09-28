defmodule ScrumpointerWeb.Api.User do
  use ScrumpointerWeb, :controller
  alias Coherence.SessionController

  def logout(conn, params) do
    SessionController.delete(conn, params)
  end
end
