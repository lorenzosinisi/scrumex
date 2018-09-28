defmodule Scrumpointer.UserInvitations do
  alias Scrumpointer.Repo
  import Ecto.Query, warn: false

  def create(project_id: project_id, user_email: email) do
    email
    |> do_find(project_id)
    |> do_create(email, project_id)
  end

  def accept(project_id: project_id, user_email: email, user_id: user_id) do
    email
    |> do_find(project_id)
    |> do_accept(user_id, email, project_id)
  end

  defp do_accept(nil, _user_id, email, _project_id) do
    {:error, "No invitation found for #{email}"}
  end

  defp do_accept(
         %Scrumpointer.Web.UserInvitation{} = existing_invitation,
         user_id,
         _email,
         project_id
       ) do
    Scrumpointer.ProjectUsers.add_user_to_project(project_id: project_id, user_id: user_id)
    Repo.delete!(existing_invitation)
  end

  defp do_create(%Scrumpointer.Web.UserInvitation{} = existing_invitation, _email, _project_id) do
    {:ok, existing_invitation}
  end

  defp do_create(nil, email, project_id) do
    Scrumpointer.Web.UserInvitation.changeset(%Scrumpointer.Web.UserInvitation{}, %{
      email: email,
      project_id: project_id
    })
    |> Repo.insert()
  end

  defp do_find(email, project_id) do
    Repo.get_by(Scrumpointer.Web.UserInvitation, email: email, project_id: project_id)
  end

  def delete(project_id: project_id, user_email: email) do
    invitation =
      Repo.get_by(Scrumpointer.Web.UserInvitation, project_id: project_id, email: email)

    if invitation do
      Repo.delete!(invitation)
    end
  end
end
