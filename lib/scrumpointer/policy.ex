defmodule Scrumpointer.Policy do
  alias Scrumpointer.Coherence.User

  alias Scrumpointer.Web.{
    Comment,
    AttachmentUpload
  }

  def can?(%User{}, %Comment{}, :create) do
    true
  end

  def can?(%User{}, %Comment{}, :index) do
    true
  end

  def can?(%User{} = user, %Comment{} = comment, :delete) do
    if user.id == comment.user_id do
      true
    else
      false
    end
  end

  def can?(%User{} = user, %AttachmentUpload{} = attachment, :delete) do
    if user.id == attachment.user_id do
      true
    else
      false
    end
  end

  def can?(_) do
    false
  end
end
