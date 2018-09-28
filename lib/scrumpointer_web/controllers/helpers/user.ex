defmodule ScrumpointerWeb.Helpers.User do
  @moduledoc """
    use this helper by adding "use ScrumpointerWeb.Helpers.User" to your module
    includes and requires ScrumpointerWeb.Helpers.User into your module
    
    Makes available the functions: 
      current_user(conn) to get the current user using a Plug.Conn

  """
  alias Scrumpointer.Coherence.User
  alias __MODULE__, as: Self

  defmacro __using__(_) do
    quote do
      require Self

      @doc """
       Returns the current logged in User for Coherence
      """
      @spec current_user(binary) :: User | any
      def current_user(conn), do: Coherence.current_user(conn)
    end
  end
end
