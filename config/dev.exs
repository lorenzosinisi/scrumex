use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :scrumpointer, ScrumpointerWeb.Endpoint,
  http: [port: 4000],
  canonical_host: "http://localhost",
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [
    node: [
      "node_modules/brunch/bin/brunch",
      "watch",
      "--stdin",
      cd: Path.expand("../assets", __DIR__)
    ]
  ]

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: System.get_env("GITHUB_CLIENT_ID"),
  client_secret: System.get_env("GITHUB_CLIENT_SECRET")

# ## SSL Support
#
# In order to use HTTPS in development, a self-signed
# certificate can be generated by running the following
# command from your terminal:
#
#     openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" -keyout priv/server.key -out priv/server.pem
#
# The `http:` config above can be replaced with:
#
#     https: [port: 4000, keyfile: "priv/server.key", certfile: "priv/server.pem"],
#
# If desired, both `http:` and `https:` keys can be
# configured to run both http and https servers on
# different ports.

# Watch static and templates for browser reloading.
config :scrumpointer, ScrumpointerWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{lib/scrumpointer_web/views/.*(ex)$},
      ~r{lib/scrumpointer_web/templates/.*(eex)$}
    ]
  ]

config :scrumpointer, url_encription_key: "some secret"

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :scrumpointer, Scrumpointer.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "lorenzosinisi",
  password: "",
  database: "scrumpointer_dev",
  hostname: "localhost",
  pool_size: 10

config :ex_aws,
  access_key_id: System.get_env("AWS_ACCESS_KEY"),
  secret_access_key: System.get_env("AWS_SECRET_ACCESS_KEY"),
  s3: [
    scheme: "https://",
    host: "scrumlab.s3.amazonaws.com",
    region: "eu-west-2"
  ]

config :sentry,
  dsn: System.get_env("SENTRY_DNS"),
  environment_name: :dev,
  enable_source_code_context: true,
  root_source_code_path: File.cwd!(),
  tags: %{
    env: "dev"
  },
  included_environments: [:prod]

config :stripity_stripe, api_key: System.get_env("STRIPE_SECRET_KEY")
