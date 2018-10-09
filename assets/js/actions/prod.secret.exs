use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :scrumpointer, ScrumpointerWeb.Endpoint,
  secret_key_base: "VYCvnpB/WufFRPUynrOJv5XikSambuQ3nEZGdiSTXTRXfkGCzkkm4PKO2CBf1BLf"

config :scrumpointer, Scrumpointer.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "scrumpointer",
  password: "JssZcXBGAGjqh/mgz9/Isfs1RoOBqZXwYXUNk66jZxg0T9DRIlxuiuPuLi/yIt7/",
  database: "scrumpointer",
  hostname: "localhost",
  pool_size: 18
