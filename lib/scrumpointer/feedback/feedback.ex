defmodule Scrumpointer.Feedback do
  alias Scrumpointer.Repo
  import Ecto.Query, warn: false
  use Timex

  def list(project_id) do
    actions = [
      "closed_with_open_stories",
      "reopened",
      "updated_while_being_in_a_sprint",
      "removed_from_a_sprint"
    ]

    two_weeks_ago = Timex.now() |> Timex.shift(weeks: -2)

    from(
      e in Scrumpointer.Web.Event,
      where:
        e.project_id == ^project_id and e.action in ^actions and e.inserted_at > ^two_weeks_ago,
      order_by: [:id],
      limit: 500
    )
    |> Repo.all()
  end
end
