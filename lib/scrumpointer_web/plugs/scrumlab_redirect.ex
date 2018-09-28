defmodule ScrumpointerWeb.Plugs.ScrumlabRedirect do
  import Plug.Conn

  def init(options), do: options

  def call(conn, _options) do
    do_redirect(conn, conn.host)
  end

  defp do_redirect(conn, "scrumlab.io") do
    conn
    |> Phoenix.Controller.redirect(external: "https://scrumex.com" <> conn.request_path)
    |> halt
  end

  defp do_redirect(conn, "www.scrumlab.io") do
    conn
    |> Phoenix.Controller.redirect(external: "https://scrumex.com" <> conn.request_path)
    |> halt
  end

  defp do_redirect(conn, _), do: conn
end
