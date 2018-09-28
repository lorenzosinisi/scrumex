defmodule ScrumpointerWeb.Helpers.Poll do
  @moduledoc """
    use this helper by adding "use ScrumpointerWeb.Helpers.User" to your module
    includes and requires ScrumpointerWeb.Helpers.User into your module
    
    Makes available the functions: 
      current_poll(%{params: %{id: id}}) to get the current user poll with the id

  """
  alias Scrumpointer.Web.Poll
  alias __MODULE__, as: Self

  defmacro __using__(_) do
    quote do
      require Self

      @doc """
       Returns the current logged in User for Coherence
      """
      def current_poll(id, nil), do: nil

      @spec current_poll(integer, integer) :: Poll | nil
      def current_poll(id, project_id) do
        Poll.get!(%{poll_id: id, project_id: project_id})
      end
    end
  end
end
