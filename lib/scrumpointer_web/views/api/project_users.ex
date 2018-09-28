defmodule ScrumpointerWeb.Api.ProjectUsersView do
  @moduledoc false

  use ScrumpointerWeb, :view

  def render("index.json", %{
        project_users: project_users,
        user_invitations: user_invitations
      }) do
    %{
      users: Enum.map(project_users, &user_to_json/1),
      invitations: Enum.map(user_invitations, &invitation_to_json/1)
    }
  end

  def user_to_json(user) do
    %{
      id: user.id,
      email: user.email,
      name: user.name
    }
  end

  def invitation_to_json(invitation) do
    %{
      email: invitation.email
    }
  end
end
