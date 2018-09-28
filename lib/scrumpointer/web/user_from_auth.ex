defmodule Scrumpointer.Web.UserFromAuth do
  alias Scrumpointer.Repo
  alias Scrumpointer.Coherence.User
  alias Coherence.ControllerHelpers, as: Helpers
  alias Scrumpointer.Coherence.Schemas, as: UserSchema

  def find_or_create(%{
        extra: %{raw_info: %{user: user}},
        credentials: %{token: token},
        provider: provider,
        uid: uid
      }) do
    do_find_or_create(%{
      name: user_name(user),
      email: user_email(user),
      provider: "#{provider}",
      token: token,
      password: Helpers.random_string(32),
      confirmation_token: Helpers.random_string(36),
      confirmation_sent_at: DateTime.utc_now(),
      confirmed_at: DateTime.utc_now(),
      uid: "#{uid}"
    })
  end

  defp do_find_or_create(params) do
    case get_user_by_provider(params) do
      nil ->
        create_or_find_by_params(params)

      user ->
        user_found(user, params)
    end
  end

  defp get_user_by_provider(%{} = params) do
    Repo.get_by(User, provider: "#{params.provider}", "#{params.provider}_id": "#{params.uid}")
  end

  defp create_or_find_by_params(params) do
    case find_by_email(params.email) do
      nil ->
        {:error,
         [
           "In order to login with Github you need to manually create an account first.",
           Phoenix.HTML.Link.link(" Click here", to: "/registrations/new"),
           " to create one."
         ]}

      user ->
        user_found(user, params)
    end
  end

  defp user_found(%User{} = user, %{} = params) do
    UserSchema.update_user(user, %{
      token: params.token,
      "#{params.provider}_id": "#{params.uid}",
      provider: "#{params.provider}",
      confirmed_at: params.confirmed_at
    })
  end

  defp find_by_email(email), do: Repo.get_by(User, email: email)
  defp user_name(%{"name" => name}), do: name

  defp user_email(%{"emails" => emails}) do
    primary =
      Enum.find(emails, fn %{"email" => email, "primary" => primary, "verified" => verified} ->
        primary == true && verified == true && is_binary(email)
      end)

    primary["email"]
  end
end
