defmodule Scrumpointer.Web.Policy do
  @moduledoc """
  The Web context.
  """

  import Ecto.Query, warn: false

  alias Scrumpointer.Web.Team
  alias Scrumpointer.Coherence.User

  def can_edit?(%Team{owner_id: owner_id}, %User{id: user_id}), do: owner_id == user_id

  def can_edit?(%{user_id: poll_user_id}, %User{id: current_user_id}),
    do: poll_user_id == current_user_id
end
