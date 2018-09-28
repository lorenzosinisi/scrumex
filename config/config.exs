# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :scrumpointer, ecto_repos: [Scrumpointer.Repo]

# Configures the endpoint
config :scrumpointer, ScrumpointerWeb.Endpoint,
  url: [host: "scrumex.com", port: 80],
  server: true,
  code_reloader: false,
  http: [port: 4000],
  secret_key_base: "1JvY1TjAPmhUqENhQFuzbectR5qw5LLwXwx8y28PmlOQEvv9tgDOGgukNzYV7IWH",
  render_errors: [view: ScrumpointerWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Scrumpointer.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# %% Coherence Configuration %%   Don't remove this line
config :coherence,
  user_schema: Scrumpointer.Coherence.User,
  repo: Scrumpointer.Repo,
  user_token: true,
  module: Scrumpointer,
  web_module: ScrumpointerWeb,
  router: ScrumpointerWeb.Router,
  messages_backend: ScrumpointerWeb.Coherence.Messages,
  logged_out_url: "/",
  email_from_name: "Scrumex.com",
  email_from_email: "info@scrumex.com",
  opts: [
    :confirmable,
    :authenticatable,
    :recoverable,
    :lockable,
    :trackable,
    :unlockable_with_token,
    :invitable,
    :registerable
  ]

config :coherence, ScrumpointerWeb.Coherence.Mailer,
  adapter: Swoosh.Adapters.Sendgrid,
  api_key: System.get_env("SENDGRID_API_KEY")

# %% End Coherence Configuration %%

config :ueberauth, Ueberauth,
  providers: [
    github: {Ueberauth.Strategy.Github, [default_scope: "user,public_repo,notifications,repo"]}
  ]

# Application.get_env(:cachex, :key) returns the key used to identify the cachex server

config :cachex, key: :scrumpointer_cache

config :ex_aws,
  access_key_id: System.get_env("AWS_ACCESS_KEY"),
  secret_access_key: System.get_env("AWS_SECRET_ACCESS_KEY"),
  s3: [
    scheme: "https://",
    host: "scrumlab.s3.amazonaws.com",
    region: "eu-west-2"
  ]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
