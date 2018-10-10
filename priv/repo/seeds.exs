# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Scrumpointer.Repo.insert!(%Scrumpointer.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Scrumpointer.Repo.delete_all(Scrumpointer.Coherence.User)

user =
  Scrumpointer.Coherence.User.changeset(%Scrumpointer.Coherence.User{}, %{
    name: "Lorenzo Sinisi",
    email: "lasslo.net@gmail.com",
    password: "secret",
    password_confirmation: "secret",
    confirmed_at: Ecto.DateTime.utc(),
    terms_accepted_at: Ecto.DateTime.utc()
  })
  |> Scrumpointer.Repo.insert!()

defmodule Scrumpointer.Factory.Project do
  alias Scrumpointer.Web.Project

  def build(attrs \\ %{}) do
    %{
      name: "A name",
      user_id: nil,
      team_emails: [""]
    }
    |> Map.merge(attrs)
  end

  def create(attrs \\ %{}) do
    params = attrs |> build

    Project.changeset(%Project{}, params)
    |> Scrumpointer.Repo.insert()
  end
end

project = Scrumpointer.Factory.Project.create(%{user_id: user.id})
