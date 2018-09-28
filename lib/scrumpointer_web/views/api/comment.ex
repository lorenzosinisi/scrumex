defmodule ScrumpointerWeb.Api.CommentView do
  @moduledoc false
  use ScrumpointerWeb, :view
  @regex_to_remove_linked_mentions ~r/(?:@\[(.*?)\]\((.*?)\))/

  def render("show.json", %{comment: comment}) do
    to_json(comment)
  end

  def render("deleted.json", _) do
    %{deleted: true}
  end

  def render("error.json", %{changeset: error}) do
    %{errors: error}
  end

  def render("index.json", %{comments: comments}) do
    Enum.map(comments, &to_json/1)
  end

  def to_json(comment) do
    comment = Scrumpointer.Repo.preload(comment, :replies)

    %{
      id: comment.id,
      body: to_json(:body, comment.body),
      poll_id: comment.poll_id,
      project_id: comment.project_id,
      user_id: comment.user_id,
      list_id: comment.list_id,
      inserted_at: comment.inserted_at,
      replies: Enum.map(comment.replies, &to_json/1)
    }
  end

  def to_json(:body, nil) do
    ""
  end

  def to_json(:body, "") do
    ""
  end

  def to_json(:body, body) do
    Regex.replace(@regex_to_remove_linked_mentions, body, "__\\g{1}__")
  end
end
