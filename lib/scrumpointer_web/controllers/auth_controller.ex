require Logger

defmodule ScrumpointerWeb.AuthController do
  use ScrumpointerWeb, :controller
  alias Coherence.Authentication.Session, as: SessionManager
  alias Ueberauth.Strategy.Helpers, as: UeberauthHelpers
  alias Scrumpointer.Web.UserFromAuth, as: UserFromAuth

  plug(Ueberauth)

  def request(conn, _params) do
    render(conn, "request.html", callback_url: UeberauthHelpers.callback_url(conn))
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    case UserFromAuth.find_or_create(auth) do
      {:ok, user} ->
        SessionManager.create_login(conn, user)
        |> assign(:current_user, user)
        |> put_flash(:info, "Logged in successfully.")
        |> redirect(to: "/app")

      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: "/app")
    end
  end

  def callback(conn, _params) do
    Logger.info(fn ->
      "The connection with the provider did not work as expected: #{inspect(conn)}"
    end)

    conn
    |> put_flash(:error, "The connection with the provider did not work as expected.")
    |> redirect(to: "/")
  end
end
