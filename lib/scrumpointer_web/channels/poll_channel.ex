defmodule ScrumpointerWeb.PollChannel do
  use Phoenix.Channel
  alias Scrumpointer.Web.Entry
  alias Scrumpointer.Repo
  alias Scrumpointer.Web
  alias Scrumpointer.Web.Poll
  alias Scrumpointer.Coherence.User

  @channel_prefix "polls:"

  def channel_prefix, do: @channel_prefix

  def join(@channel_prefix <> _poll_id, _params, socket) do
    {:ok, socket}
  end

  def handle_in("new_vote", %{"entry_id" => entry_id}, socket) do
    case change_vote(entry_id, socket) do
      {:ok, entry, user, _vote, poll} ->
        votes_count = Web.get_entry_vote_count(entry)
        changeset = Entry.changeset(entry, %{votes_count: votes_count})

        case Repo.update(changeset) do
          {:ok, entry} ->
            broadcast!(socket, "new_vote", %{
              "voter" => user.name,
              "entry_id" => entry.id,
              "count" => votes_count,
              voters: Entry.voters(entry)
            })

            broadcast!(socket, "consensus", %{
              "poll_id" => poll.id,
              "status" => Poll.consensus?(poll)
            })

            {:noreply, socket}

          {:error, changeset} ->
            {:error, %{reason: "Failed to vote", changeset: changeset}}
        end

      {:error, message} ->
        {:error, message}
    end
  end

  def handle_in("close_poll", %{"poll_id" => poll_id}, socket) do
    user_id = socket.assigns[:user_id]

    case close_poll!(poll_id, user_id) do
      {:ok, poll} ->
        broadcast!(socket, "close_poll", %{"poll_id" => poll.id, "closed" => poll.closed})
        {:noreply, socket}

      {:error, message} ->
        {:error, %{message: message}}
    end
  end

  defp close_poll!(poll_id, _user_id) do
    Repo.get(Poll, poll_id) |> Poll.close!()
  end

  defp change_vote(entry_id, socket) do
    entry = Repo.get(Entry, entry_id) |> Scrumpointer.Web.preload([:poll])
    poll = entry.poll

    case Repo.get(User, socket.assigns[:user_id]) do
      user = %User{} ->
        case Web.create_vote(socket, %{
               user_id: user.id,
               entry_id: entry_id,
               poll_id: poll.id,
               value: 1
             }) do
          {:ok, vote} ->
            {:ok, entry, user, vote, poll}

          {:error, %Ecto.Changeset{} = changeset} ->
            {:error, changeset}
        end

      nil ->
        {:error, :nouser}
    end
  end

  def dispatch!(socket, type, message) do
    broadcast!(socket, type, message)
  end
end
