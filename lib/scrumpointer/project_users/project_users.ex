defmodule Scrumpointer.ProjectUsers do
  alias Scrumpointer.Repo
  import Ecto.Query, warn: false

  def add_user_to_project(project_id: project_id, user_id: user_id) do
    from(
      p in Scrumpointer.Web.ProjectUsers,
      where: p.user_id == ^user_id and p.project_id == ^project_id,
      limit: 1
    )
    |> Repo.one()
    |> case do
      nil ->
        Scrumpointer.Web.ProjectUsers.changeset(%Scrumpointer.Web.ProjectUsers{}, %{
          user_id: user_id,
          project_id: project_id
        })
        |> Repo.insert()

      relationship ->
        {:ok, relationship}
    end
  end

  def add_user_to_project(project_id: project_id, user_email: email) do
    email = String.trim(email)

    case Repo.get_by(Scrumpointer.Coherence.User, email: email) do
      nil ->
        project_id |> create_user_invitation(email)

      %_{id: user_id} ->
        add_user_to_project(project_id: project_id, user_id: user_id)
    end
  end

  def remove_user_from_project(project_id: project_id, user_email: user_email, user_id: user_id) do
    Scrumpointer.Coherence.User
    |> Scrumpointer.Repo.get_by(email: user_email)
    |> case do
      %_{id: found_user_id} ->
        from(
          p in Scrumpointer.Web.ProjectUsers,
          where: p.user_id == ^found_user_id and p.project_id == ^project_id
        )
        |> Repo.delete_all()

      nil ->
        nil
    end

    Scrumpointer.UserInvitations.delete(project_id: project_id, user_email: user_email)
  end

  def membership(project_id: project_id, user_id: user_id) do
    from(
      p in Scrumpointer.Web.ProjectUsers,
      where: p.user_id == ^user_id and p.project_id == ^project_id
    )
    |> Repo.one()
  end

  def create_user_invitation(project_id, email) do
    Scrumpointer.UserInvitations.create(project_id: project_id, user_email: email)
  end
end
