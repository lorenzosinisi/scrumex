defmodule Scrumpointer.Web.Wizard do
  alias Scrumpointer.Coherence.User
  alias Scrumpointer.Web

  def step(conn = %Plug.Conn{}) do
    case Coherence.current_user(conn) |> Web.preload([:teams, :polls]) do
      %User{} = user ->
        do_next_step(%{teams: user.teams, polls: user.polls})

      nil ->
        "/sessions/new"

      _ ->
        nil
    end
  end

  defp do_next_step(%{teams: [], polls: []}) do
    "/dashboard/teams/new"
  end

  defp do_next_step(%{teams: [_team | _rest], polls: [_poll | _polls]}) do
    "/stories"
  end

  defp do_next_step(%{teams: [_team | _rest], polls: []}) do
    "/stories/new"
  end

  defp do_next_step(something_else) do
    IO.inspect(something_else)
    :error
  end
end
