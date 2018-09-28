defmodule Scrumpointer.Factories.PointScalesTest do
  use Scrumpointer.DataCase

  describe "biggest" do
    alias Scrumpointer.Factories.PointScales
    
    test "fibonacci scale" do
      assert PointScales.biggest(["21", "34", "Pass"], %{scale_type: "fibonacci_scale"}) == "34"

      assert PointScales.biggest(["Pass"], %{scale_type: "fibonacci_scale"}) == nil

      assert PointScales.biggest(["89", "1"], %{scale_type: "fibonacci_scale"}) == "89"
      assert PointScales.biggest([], %{scale_type: "fibonacci_scale"}) == nil
    end

    test "t-shirts scale" do
      assert PointScales.biggest(["xxs", "xs", "s", "m", "l", "xl", "xxl", "?", "Pass"], %{scale_type: "t_shirts"}) == "xxl"

      assert PointScales.biggest(["xxs", "xs", "s", "?", "Pass"], %{scale_type: "t_shirts"}) == "s"

      assert PointScales.biggest(["l","xxl", "?"], %{scale_type: "t_shirts"}) == "xxl"
      assert PointScales.biggest([], %{scale_type: "t_shirts"}) == nil
    end

    test "modified fibonacci scale" do
      assert PointScales.biggest(["0", "½", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?", "Pass"], %{scale_type: "modified_fibonacci"}) == "100"

      assert PointScales.biggest(["0"], %{scale_type: "modified_fibonacci"}) == "0"

      assert PointScales.biggest(["0", "0.5"], %{scale_type: "modified_fibonacci"}) == "0.5"

      assert PointScales.biggest(["13", "20", "40", "100", "?", "Pass"], %{scale_type: "modified_fibonacci"}) == "100"

      assert PointScales.biggest(["?", "Pass"], %{scale_type: "modified_fibonacci"}) == nil

      assert PointScales.biggest([], %{scale_type: "modified_fibonacci"}) == nil
    end

    test "power of two scale" do
      assert PointScales.biggest(["0", "1", "2", "4", "8", "16", "32", "64", "?", "Pass"], %{scale_type: "power_of_two"}) == "64"

      assert PointScales.biggest(["0"], %{scale_type: "power_of_two"}) == "0"

      assert PointScales.biggest(["0", "1"], %{scale_type: "power_of_two"}) == "1"

      assert PointScales.biggest(["13", "20", "64", "100", "?", "Pass"], %{scale_type: "power_of_two"}) == "64"

      assert PointScales.biggest(["?", "Pass"], %{scale_type: "power_of_two"}) == nil
      assert PointScales.biggest([], %{scale_type: "power_of_two"}) == nil
    end
  end
end