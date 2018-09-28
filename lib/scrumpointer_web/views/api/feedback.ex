defmodule ScrumpointerWeb.Api.FeedbackView do
  @moduledoc false
  use ScrumpointerWeb, :view

  def render("index.json", %{feedback: feedback}) do
    Enum.map(feedback, &to_json/1)
  end

  def to_json(feedback) do
    %{
      id: feedback.id,
      action: feedback.action,
      inserted_at: feedback.inserted_at,
      name: feedback.name,
      resource_id: feedback.resource_id,
      user_id: feedback.user_id,
      project_id: feedback.project_id
    }
  end
end
