defmodule ScrumpointerWeb.Api.Upload do
  use ScrumpointerWeb, :controller
  alias Scrumpointer.Web.AttachmentUpload
  use ScrumpointerWeb.Helpers.{Project, User}
  import Scrumpointer.Policy

  plug(:set_project!)

  def create(%{assigns: %{current_user: user, project: project}} = conn, %{
        "story_id" => story_id,
        "file" => image
      }) do
    file_uuid = UUID.uuid4(:hex)
    unique_filename = "#{file_uuid}-#{image.filename}"
    bucket_name = System.get_env("BUCKET_NAME")
    {:ok, file} = File.read(image.path)

    ExAws.S3.put_object(bucket_name, unique_filename, file) |> ExAws.request!()

    image_url = "https://#{bucket_name}.s3.amazonaws.com/#{bucket_name}/#{unique_filename}"

    changeset =
      AttachmentUpload.changeset(%AttachmentUpload{}, %{
        image_url: image_url,
        project_id: project.id,
        user_id: user.id,
        poll_id: story_id,
        name: unique_filename
      })

    case Scrumpointer.Repo.insert(changeset) do
      {:ok, attachment_upload} ->
        render(conn, "show.json", attachment_upload: attachment_upload)

      {:error, _changeset} ->
        conn
        |> put_status(422)
        |> render("error.json", error: "Something went wrong")
    end
  end

  def delete(%{assigns: %{current_user: user}} = conn, _) do
    attachment = get_attachment(conn)
    name = attachment.name

    if can?(user, attachment, :delete) do
      case Scrumpointer.Repo.delete(attachment) do
        {:ok, _} ->
          bucket_name = System.get_env("BUCKET_NAME")

          ExAws.S3.delete_object(bucket_name, name)
          |> ExAws.request!()

          render(conn, "deleted.json", %{})

        _ ->
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

  def index(
        %{assigns: %{current_user: _user, project: _project}} = conn,
        params = %{"story_id" => _story_id}
      ) do
    render(conn, "index.json", attachment_uploads: AttachmentUpload.list_from_params(params))
  end

  defp get_attachment(conn) do
    Scrumpointer.Repo.get_by!(
      AttachmentUpload,
      id: conn.params["attachment_id"],
      project_id: conn.params["project_id"]
    )
  end

  defp set_project!(conn, _) do
    project = current_project(conn.params["project_id"], current_user(conn))
    assign(conn, :project, project)
  end
end
