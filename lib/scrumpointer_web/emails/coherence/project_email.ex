Code.ensure_loaded(Phoenix.Swoosh)

defmodule ScrumpointerWeb.Coherence.ProjectEmail do
  @moduledoc false
  use Phoenix.Swoosh,
    view: ScrumpointerWeb.Coherence.EmailView,
    layout: {ScrumpointerWeb.Coherence.LayoutView, :email}

  alias Swoosh.Email
  require Logger
  import ScrumpointerWeb.Gettext

  defp site_name, do: "Scrumex.com"

  def onboarding(project) do
    %Email{}
    |> from(from_email())
    |> to(user_email(project.user))
    |> add_reply_to()
    |> subject("#{project.name} created succesfully!")
    |> render_body("new_project.html", %{
      url: Protocol.WebApp.url(project),
      name: first_name(project.user.name),
      project_name: first_name(project.name)
    })
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
