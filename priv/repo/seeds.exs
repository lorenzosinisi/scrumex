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


Scrumpointer.Repo.delete_all Scrumpointer.Coherence.User

Scrumpointer.Coherence.User.changeset(
  %Scrumpointer.Coherence.User{}, 
  %{
    name: "Test User", 
    email: "testuser@example.com", 
    password: "secret", 
    password_confirmation: "secret",
    confirmed_at: Ecto.DateTime.utc
  }
) |> Scrumpointer.Repo.insert!