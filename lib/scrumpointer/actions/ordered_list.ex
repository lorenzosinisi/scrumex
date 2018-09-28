defmodule OrderedList do
  import Ecto.Query, warn: false

  def up(repo, record, list \\ nil, opts \\ [primary_type: :id, column_name: 'priority']) do
    %{
      previous_id: previous_id,
      previous: previous
    } = find_row(repo, record, opts[:primary_type], list)

    if previous_id do
      %{
        previous: second_previous
      } = find_row(repo, repo.get(record.__struct__, previous_id), opts[:primary_type], list)
    end

    new_rank = move(second_previous, previous)
    %{record | "#{opts[:column_name]}": new_rank}
  end

  def down(repo, record, list, opts \\ [primary_type: :id, column_name: 'priority']) do
    %{
      next_id: next_id,
      next: next
    } = find_row(repo, record, nil, list)

    if next_id do
      %{
        next: succ
      } = find_row(repo, repo.get(record.__struct__, next_id), opts[:primary_type], list)
    end

    new_rank = move(next, succ)

    %{record | "#{opts[:column_name]}": new_rank}
  end

  def place_between(
        record,
        %{priority: prev_priority},
        %{priority: succ_priority},
        opts \\ [column_name: 'priority']
      ) do
    if prev_priority == succ_priority do
      {:error, :reorder}
    else
      prev_priority = to_decimal(prev_priority)
      succ_priority = to_decimal(succ_priority)
      new_rank = move(prev_priority, succ_priority)

      %{record | "#{opts[:column_name]}": new_rank}
    end
  end

  def place_between(record, nil, %{priority: succ_priority}, opts = [column_name: 'priority']) do
    next = to_decimal(succ_priority)
    new_rank = move(nil, next)

    %{record | "#{opts[:column_name]}": new_rank}
  end

  def place_between(record, %{priority: prev_priority}, nil, opts = [column_name: 'priority']) do
    prev = to_decimal(prev_priority)
    new_rank = move(prev, nil)

    %{record | "#{opts[:column_name]}": new_rank}
  end

  def rank_last(repo, record, list, opts \\ [column_name: 'priority']) do
    list = ranked(repo, list)

    {:ok,
     %{
       previous: previous,
       next: next
     }} = Enum.fetch(list, -1)

    previous = to_decimal(previous)
    next = to_decimal(next)
    new_rank = move(previous, next)

    %{record | "#{opts[:column_name]}": new_rank}
  end

  def rank_first(repo, record, list, opts \\ [column_name: 'priority']) do
    list = ranked(repo, list)
    %{previous: previous, next: next} = hd(list)
    previous = to_decimal(previous)
    next = to_decimal(next)
    new_rank = move(previous, next)

    %{record | "#{opts[:column_name]}": new_rank}
  end

  def ranked(repo, list) do
    query(repo, list)
  end

  defp find_row(repo, record, :binary_id, list) do
    list = ranked(repo, list)

    list
    |> Enum.find(fn x ->
      {:ok, uuid} = Ecto.UUID.load(x.id)
      uuid == record.id
    end)
  end

  defp find_row(repo, record, _type, list) do
    ranked(repo, list)
    |> Enum.find(fn x -> x.id == record.id end)
  end

  defp query(repo, query) do
    sql(repo, query)
  end

  defp sql(repo, list) do
    from(
      u in list,
      select: %{
        u
        | previous: fragment("lag(priority)  OVER (ORDER BY priority DESC)"),
          next: fragment("lead(priority) OVER (ORDER BY priority DESC)"),
          previous_id: fragment("lag(id)        OVER (ORDER BY priority DESC)"),
          next_id: fragment("lead(id)       OVER (ORDER BY priority DESC)")
      }
    )
    |> repo.all
  end

  def move(previous, next) do
    do_move(previous, next)
  end

  defp do_move(nil, next) do
    next + 0.001
  end

  defp do_move(previous, nil) do
    previous - 0.001
  end

  defp do_move(previous, next) do
    (previous + next) / 2
  end

  defp to_decimal(nil), do: nil

  defp to_decimal(value) do
    {value, _} = Float.parse(Decimal.to_string(value))
    value
  end
end
