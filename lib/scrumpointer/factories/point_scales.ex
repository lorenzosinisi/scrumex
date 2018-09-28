defmodule Scrumpointer.Factories.PointScales do
  @fibonaccy_scale ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "?", "Pass"]
  @modified_fibonacci ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "Pass"]
  @t_shirts ["xxs", "xs", "s", "m", "l", "xl", "xxl", "?", "Pass"]
  @power_of_two ["0", "1", "2", "4", "8", "16", "32", "64", "?", "Pass"]

  @scales [
    "Fibonaccy scale ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, Pass )": "fibonacci_scale",
    "Modified Fibonacci ( 0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?, Pass )": "modified_fibonacci",
    # "T-Shirts ( xxs, xs, s, m, l, xl, xxl, ?, Pass )":           "t_shirts",
    "Power of 2 ( 0, 1, 2, 4, 8, 16, 32, 64, ?, Pass )": "power_of_two"
    # {}"Custom scale":             "custom"
  ]

  def build(type, scale), do: do_build(type, scale)

  def scales, do: @scales

  def biggest(list, type) do
    do_biggest(list -- ["?", "Pass"], type)
  end

  defp do_biggest([], _), do: nil

  defp do_biggest(list, %{scale_type: type}) when is_list(list) do
    scale = build(type, nil)
    scale_with_index = Enum.with_index(scale)

    filtered =
      Enum.filter(scale_with_index, fn {element, _index} -> Enum.member?(list, element) end)

    indexes = Enum.map(filtered, fn {_, index} -> index end)

    if Enum.count(indexes) == 0,
      do:
        raise(
          ArgumentError,
          message:
            "The list \"#{Enum.join(list, ", ")}\" does not contain any of the element in #{type}"
        )

    [last | _] = Enum.reverse(indexes)

    case Enum.fetch(scale, last) do
      {:ok, value} ->
        value

      :error ->
        {:error, %{list: list, type: scale, filtered: filtered}}
    end
  end

  defp do_build("fibonacci_scale", _custom_scale), do: @fibonaccy_scale
  defp do_build("modified_fibonacci", _custom_scale), do: @modified_fibonacci
  defp do_build("t_shirts", _custom_scale), do: @t_shirts
  defp do_build("power_of_two", _custom_scale), do: @power_of_two
  defp do_build("custom", scale) when is_list(scale), do: scale
  defp do_build(_anything_else, _custom_scale), do: @fibonaccy_scale
end
