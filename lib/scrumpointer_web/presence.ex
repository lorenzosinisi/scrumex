defmodule ScrumpointerWeb.Presence do
  use Phoenix.Presence,
    otp_app: :scrumpointer,
    pubsub_server: Scrumpointer.PubSub
end
