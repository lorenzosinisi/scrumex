# Scrumex - online tool for management of scrum teams.
Hosted version: [`https://scrumex.com`](https://scrum-ex.com/?ref=github)

Scrumex.com is an open source web app for agile teams that use Scrum. It allows the creation of teams and stories to  manage your scrum process in the simplest possible way.

## Features

 - create and edit stories
 - manage and give priority to the stories in your burndownchart
 - create sprints
 - assign stories to yourself
 - comment on stories
 - add and manage team members for a project
 - mention team members in comments

## Tech

`Erlang/OTP 19`

`Elixir 1.5.1`

`Phoenix ~> 1.3.0`

`React/Redux`

`Postgres 10.3`


## Development

To start your web server:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `cd assets && npm install`
  * Start Phoenix endpoint with `mix phx.server`


Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

## Deployment

* Make sure you can ssh root@scrumex.com
* Run `mix edeliver build release --branch="master"` to build the new release
* Run `mix edeliver deploy release to production --branch="master"` to deploy the new release

## TODO

 - write more tests
 - cleanup the code from experimentation (there is a mix of business logic in contexts and elsewhere)
