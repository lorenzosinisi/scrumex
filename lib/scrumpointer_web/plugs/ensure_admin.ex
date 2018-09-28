defmodule ScrumpointerWeb.Plugs.EnsureAdmin do
  import Plug.Conn

  def init(options), do: options

  def call(conn, _options) do
    do_ensure_admin(conn)
  end

  defp do_ensure_admin(%{assigns: %{current_user: %_{admin: true} = _admin}} = conn) do
    conn
  end

  defp do_ensure_admin(%{assigns: %{current_user: _admin}} = conn) do
    conn
    |> Phoenix.Controller.redirect(external: "https://scrumex.com")
    |> halt
  end
end
