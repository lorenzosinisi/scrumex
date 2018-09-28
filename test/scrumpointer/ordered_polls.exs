defmodule Scrumpointer.OrderedPollsTest do
  use Scrumpointer.DataCase
  #use OrderedList
  alias Scrumpointer.Web.Project

  @valid_list [
    %OrderedList.Node{
      id: 1,
      priority: "0.0",
      previous: nil,
      previous_id: nil,
      next_id: 2,
      next: "0.001"
    },
    %OrderedList.Node{
      id: 2,
      priority: "0.001",
      previous: "0.0",
      previous_id: 1,
      next_id: nil,
      next: nil
    }
  ]

  test "the obvious" do
    assert true == true
  end

  test "ranked/2 when given a custom list" do
    assert @valid_list = OrderedList.ranked(nil, @valid_list)
  end

  test "ranked/2 when given an empty list" do
    assert [] = OrderedList.ranked(nil, [])
  end

  @table_name   'polls'               # required
  @repo         Scrumpointer.Repo     # required
  @primary_type :binary_id            # optional
  @model        Scrumpointer.Web.Poll # required ecto model
  @precision    0.001
  @column_name  'priority'
  test "ranked/2 when given nothing" do
    assert [] = OrderedList.ranked(@repo)
  end

end