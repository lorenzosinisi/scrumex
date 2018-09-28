defmodule Scrumpointer.Repo do
  use Ecto.Repo, otp_app: :scrumpointer

  @doc """
  Dynamically loads the repository url from the
  DATABASE_URL environment variable.
  """
  def init(_, opts) do
    {:ok, Keyword.put(opts, :url, System.get_env("DATABASE_URL"))}
  end

  @doc """
  First, add code to execute and load models from SQL, and using that code,
  execute something like the above SQL to receive a set of models based on a query.
  """
  def execute_and_load(sql, params, model) do
    Ecto.Adapters.SQL.query!(__MODULE__, sql, params)
    |> load_into(model)
  end

  defp load_into(response, model) do
    Enum.map(response.rows, fn row ->
      fields =
        Enum.reduce(Enum.zip(response.columns, row), %{}, fn {key, value}, map ->
          Map.put(map, String.to_existing_atom(key), value)
        end)

      struct(model, fields)
    end)
  end
end
