# Scrumex - online tool for management of scrum teams.
Hosted version: [`https://scrumex.com`](https://scrumex.com/?ref=github)


Scrumpointer is an open source web app for agile teams. It allows the creation of teams and polls to  manage your scrum process in the simplest way possible.

The scrum master creates stories and sends the link to the rest of the team that can vote until the story is open.


`Erlang/OTP 19`

`Elixir 1.5.1`

`Phoenix ~> 1.3.0`


To start your web server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`


Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Todo: [`list here`](https://github.com/lorenzosinisi/scrumpointer/issues)

To deploy:

* Make sure you can ssh deploy@scrumex.com
* Run `mix edeliver build release --branch="master"` to build the new release
* Run `mix edeliver deploy release to production --branch="master"` to deploy the new release
