Code.ensure_loaded(Phoenix.Swoosh)

defmodule ScrumpointerWeb.Coherence.UserEmail do
  @moduledoc false
  @regex_to_remove_linked_mentions ~r/(?:@\[(.*?)\]\((.*?)\))/
  use Phoenix.Swoosh,
    view: ScrumpointerWeb.Coherence.EmailView,
    layout: {ScrumpointerWeb.Coherence.LayoutView, :email}

  alias Swoosh.Email
  require Logger
  import ScrumpointerWeb.Gettext

  defp site_name, do: "Scrumex.com"

  def password(user, url) do
    %Email{}
    |> from(from_email())
    |> to(user_email(user))
    |> add_reply_to()
    |> subject(
      dgettext("coherence", "%{site_name} - Reset password instructions", site_name: site_name())
    )
    |> render_body("password.html", %{url: url, name: first_name(user.name)})
  end

  def confirmation(user, url) do
    %Email{}
    |> from(from_email())
    |> to(user_email(user))
    |> add_reply_to()
    |> subject(
      dgettext("coherence", "%{site_name} - Confirm your new account", site_name: site_name())
    )
    |> render_body("confirmation.html", %{url: url, name: first_name(user.name)})
  end

  def invitation(invitation, url) do
    %Email{}
    |> from(from_email())
    |> to(user_email(invitation))
    |> add_reply_to()
    |> subject(
      dgettext(
        "coherence",
        "%{site_name} - Invitation to create a new account",
        site_name: site_name()
      )
    )
    |> render_body("invitation.html", %{url: url, name: first_name(invitation.name)})
  end

  def unlock(user, url) do
    %Email{}
    |> from(from_email())
    |> to(user_email(user))
    |> add_reply_to()
    |> subject(
      dgettext("coherence", "%{site_name} - Unlock Instructions", site_name: site_name())
    )
    |> render_body("unlock.html", %{url: url, name: first_name(user.name)})
  end

  def new_comment(user, comment, commenter) do
    %Email{}
    |> from(from_email())
    |> to(user_email(user))
    |> add_reply_to()
    |> subject("#{commenter.name} commented on Scrumex")
    |> render_body("new_comment.html", %{
      url: Protocol.WebApp.url(comment),
      name: first_name(user.name),
      comment_body: replace_mentions(comment.body),
      story_name: comment.poll.title
    })
  end

  defp replace_mentions("") do
    ""
  end

  defp replace_mentions(nil) do
    ""
  end

  defp replace_mentions(body) do
    Regex.replace(@regex_to_remove_linked_mentions, body, "\\g{1}")
  end

  defp slice_comment_body(nil) do
    "New Comment"
  end

  defp slice_comment_body(body, till \\ 100) when is_binary(body) do
    String.slice(body, 0, till) <> "..."
  end

  defp add_reply_to(mail) do
    case Coherence.Config.email_reply_to() do
      nil -> mail
      true -> reply_to(mail, from_email())
      address -> reply_to(mail, address)
    end
  end

  defp first_name(name) do
    case String.split(name, " ") do
      [first_name | _] -> first_name
      _ -> name
    end
  end

  defp user_email(user) do
    {user.name, user.email}
  end

  defp from_email do
    case Coherence.Config.email_from() do
      nil ->
        Logger.error(
          ~s|Need to configure :coherence, :email_from_name, "Name", and :email_from_email, "me@example.com"|
        )

        nil

      {name, email} = email_tuple ->
        if is_nil(name) or is_nil(email) do
          Logger.error(
            ~s|Need to configure :coherence, :email_from_name, "Name", and :email_from_email, "me@example.com"|
          )

          nil
        else
          email_tuple
        end
    end
  end
end
