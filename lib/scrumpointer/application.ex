defmodule Scrumpointer.Application do
  use Application

  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      # Start the Ecto repository
      supervisor(Scrumpointer.Repo, []),
      # Start the presence supervisor
      # supervisor(ScrumpointerWeb.Presence, []),
      # Start the endpoint when the application starts
      supervisor(ScrumpointerWeb.Endpoint, []),
      # Start your own worker by calling: Scrumpointer.Worker.start_link(arg1, arg2, arg3)
      worker(Cachex, [Application.get_env(:cachex, :key), []])
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Scrumpointer.Supervisor]
    res = Supervisor.start_link(children, opts)

    if !(Sentry.Logger in :gen_event.which_handlers(:error_logger)) do
      :ok = :error_logger.add_report_handler(Sentry.Logger)
    end

    res
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    ScrumpointerWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
