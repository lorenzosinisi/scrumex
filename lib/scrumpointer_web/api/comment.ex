defmodule ScrumpointerWeb.Api.Comment do
  use ScrumpointerWeb, :controller
  use ScrumpointerWeb.Helpers.Project
  use ScrumpointerWeb.Helpers.User
  alias Scrumpointer.Web.{Comment, Poll}
  alias Scrumpointer.BusinessLogic
  import Scrumpointer.Policy

  plug(:set_project!)
  plug(:set_story!)

  def create(%{assigns: %{current_user: user}} = conn, comment_params) do
    comment_params = Map.put(comment_params, "user_id", user.id)

    if can?(user, %Comment{}, :create) do
      case BusinessLogic.create_comment(comment_params, []) do
        {:ok, comment} ->
          render(conn, "show.json", comment: comment)

        {:error, changeset} ->
          conn
          |> put_status(422)
          |> render("error.json", changeset: changeset)
      end
    else
      conn
      |> put_status(422)
      |> render("error.json", changeset: %{error: "Permission denied"})
    end
  end

  def index(%{assigns: %{current_user: user}} = conn, comment_params) do
    if can?(user, %Comment{}, :index) do
      render(conn, "index.json", comments: Comment.list_from_params(comment_params))
    else
      conn
      |> put_status(422)
      |> render("error.json", changeset: %{error: "Permission denied"})
    end
  end

  def delete(%{assigns: %{current_user: user}} = conn, _) do
    comment = get_comment(conn)

    if can?(user, comment, :delete) do
      case Comment.delete(comment.id) do
        {:ok, _} ->
          render(conn, "deleted.json")
        true ->
          conn
          |> put_status(422)
          |> render("error.json", changeset: %{error: "Something went wrong"})
      end
    else
      conn
      |> put_status(422)
      |> render("error.json", changeset: %{error: "Permission denied"})
    end
  end

  defp get_comment(conn) do
    Scrumpointer.Repo.get_by!(
      Comment,
      id: conn.params["comment_id"],
      project_id: conn.params["project_id"]
    )
  end

  defp set_story!(conn, _) do
    story =
      Scrumpointer.Repo.get_by!(
        Poll,
        id: conn.params["poll_id"],
        project_id: conn.params["project_id"]
      )

    conn |> assign(:story, story)
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    conn |> assign(:project, project)
  end
end
