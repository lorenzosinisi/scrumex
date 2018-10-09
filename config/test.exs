use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :scrumpointer, ScrumpointerWeb.Endpoint,
  canonical_host: "http://localhost",
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :scrumpointer, Scrumpointer.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "elixir",
  password: "",
  key_urls: "some secret",
  database: "scrumpointer_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: System.get_env("GITHUB_CLIENT_ID"),
  client_secret: System.get_env("GITHUB_CLIENT_SECRET")

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
  environment_name: :test,
  enable_source_code_context: true,
  root_source_code_path: File.cwd!(),
  tags: %{
    env: "test"
  },
  included_environments: [:prod]

config :stripity_stripe, api_key: System.get_env("STRIPE_SECRET_KEY")
