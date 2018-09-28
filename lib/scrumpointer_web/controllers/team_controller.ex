defmodule ScrumpointerWeb.TeamController do
  use ScrumpointerWeb, :controller

  alias Scrumpointer.Web
  alias Scrumpointer.Web.Team

  def index(conn, _params) do
    current_user = Coherence.current_user(conn)
    teams = Web.list_teams(current_user.id)
    render(conn, "index.html", teams: teams)
  end

  def new(conn, _params) do
    changeset = Web.change_team(%Team{})
    render(conn, "new.html", changeset: changeset, member_emails: [])
  end

  def create(conn, %{"team" => team_params}) do
    current_user = Coherence.current_user(conn)
    params = Map.put(team_params, "owner_id", current_user.id)

    case Web.create_team(params) do
      {:ok, team} ->
        conn
        |> put_flash(:info, "Team created successfully.")
        |> redirect(to: team_path(conn, :show, team))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    current_user = Coherence.current_user(conn)
    team = Web.get_team!(id, current_user.id)
    render(conn, "show.html", team: team, member_emails: team.member_emails)
  end

  def edit(conn, %{"id" => id}) do
    current_user = Coherence.current_user(conn)
    team = Web.get_team!(id, current_user.id)
    changeset = Web.change_team(team)
    render(conn, "edit.html", team: team, changeset: changeset, member_emails: team.member_emails)
  end

  def update(conn, %{"id" => id, "team" => team_params}) do
    current_user = Coherence.current_user(conn)
    team = Web.get_team!(id, current_user.id)

    case Web.update_team(team, team_params) do
      {:ok, team} ->
        conn
        |> put_flash(:info, "Team updated successfully.")
        |> redirect(to: team_path(conn, :show, team))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(
          conn,
          "edit.html",
          team: team,
          changeset: changeset,
          member_emails: team.member_emails
        )
    end
  end

  def delete(conn, %{"id" => id}) do
    current_user = Coherence.current_user(conn)
    team = Web.get_team!(id, current_user.id)
    {:ok, _team} = Web.delete_team(team)

    conn
    |> put_flash(:info, "Team deleted successfully.")
    |> redirect(to: team_path(conn, :index))
  end
end
