defmodule ScrumpointerWeb.Api.AccountTest do
  use ScrumpointerWeb.ConnCase, async: true
  alias Scrumpointer.Factory

  describe "show/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, %{user: user}}
    end

    test "it returns a user when existing", %{conn: conn, user: user} do
      conn = assign(conn, :current_user, user)
      email = user.email
      name = user.name

      conn = get(conn, "/api/account")

      assert json_response(conn, 200) ==
               %{
                 "email" => email,
                 "name" => name
               }
    end

    test "it returns 302 when the user is not logged in", %{conn: conn} do
      conn = get(conn, "/api/account")

      assert conn.status == 302
    end
  end

  describe "delete/2" do
    setup do
      {:ok, user} = Factory.User.create()
      {:ok, %{user: user}}
    end

    test "it works when the user exists and it is deleted", %{conn: conn, user: user} do
      conn = assign(conn, :current_user, user)

      conn = delete(conn, "/api/account")

      assert json_response(conn, 200) == %{"ok" => "deleted"}
    end

    test "it returns 302 when the user is not logged in", %{conn: conn} do
      conn = delete(conn, "/api/account")

      assert conn.status == 302
    end
  end
end
