defmodule ScrumpointerWeb.PageController do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.User

  def index(conn, params) do
    user = current_user(conn)

    if user do
      redirect(conn, to: "/app")
    else
      render(conn, "index.html", params: params, current_user: current_user(conn))
    end
  end
end
