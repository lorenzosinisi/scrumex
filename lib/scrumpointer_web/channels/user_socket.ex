defmodule ScrumpointerWeb.UserSocket do
  use Phoenix.Socket
  alias ScrumpointerWeb.PollChannel

  ## Channels
  # channel "room:*", ScrumpointerWeb.RoomChannel
  channel("#{PollChannel.channel_prefix()}*", PollChannel)

  ## Transports
  transport(
    :websocket,
    Phoenix.Transports.WebSocket,
    check_origin: [
      "https://www.planning-poker.online",
      "http://staging.scrumex.com",
      "http://scrumex.com",
      "https://scrumlab.io",
      "https://workplace.scrumex.com",
      "https://www.scrumlab.io",
      "https://planning-poker.online",
      "https://story-points-manager.herokuapp.com",
      "http://0.0.0.0:4000/",
      "http://localhost:4000/"
    ],
    timeout: 45_000
  )

  # transport :longpoll, Phoenix.Transports.LongPoll

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.

  def connect(%{"token" => token}, socket) do
    case Phoenix.Token.verify(socket, "user", token, max_age: 1_209_600) do
      {:ok, user_id} ->
        socket = assign(socket, :user_id, user_id)
        {:ok, socket}

      {:error, _} ->
        :error
    end
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     ScrumpointerWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(socket), do: "user_socket:#{socket.assigns.user_id}"
end