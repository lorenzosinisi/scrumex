defmodule ScrumpointerWeb.Api.UploadView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("show.json", %{attachment_upload: attachment_upload}) do
    to_json(attachment_upload)
  end

  def render("index.json", %{attachment_uploads: attachment_uploads}) do
    Enum.map(attachment_uploads, &to_json/1)
  end

  def render("error.json", %{error: error}) do
    %{error: error}
  end

  def render("deleted.json", _) do
    %{ok: "deleted"}
  end

  def to_json(attachment_upload) do
    %{
      id: attachment_upload.id,
      name: attachment_upload.name,
      poll_id: attachment_upload.poll_id,
      project_id: attachment_upload.project_id,
      user_id: attachment_upload.user_id,
      inserted_at: attachment_upload.inserted_at,
      image_url: attachment_upload.image_url
    }
  end
end
