defmodule ScrumpointerWeb.Helpers.Project do
  @moduledoc """
    use this helper by adding "use ScrumpointerWeb.Helpers.User" to your module
    includes and requires ScrumpointerWeb.Helpers.User into your module
    
    Makes available the functions: 
      current_project(project_id, user_id) to get the current Project for the current user

  """
  alias Scrumpointer.Web.Project
  alias __MODULE__, as: Self

  defmacro __using__(_) do
    quote do
      require Self
      @spec current_project(integer, integer) :: Poll | nil
      def current_project(project_id, %{} = user) when is_binary(project_id) do
        Project.get(%{id: project_id, user: user, user_email: user.email})
      end
    end
  end
end
