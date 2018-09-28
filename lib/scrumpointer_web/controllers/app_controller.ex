defmodule ScrumpointerWeb.AppController do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.User

  def show(conn, _params) do
    render(
      conn,
      "show.html",
      user_token: user_token(conn),
      layout: {ScrumpointerWeb.LayoutAppView, "app.html"}
    )
  end

  defp user_token(conn) do
    Phoenix.Token.sign(conn, "user", current_user(conn).id)
  end
end
