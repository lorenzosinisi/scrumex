defmodule Scrumpointer.Factory.User do
  alias Scrumpointer.Coherence.User

  def build(attrs \\ %{}) do
    %{
      name: "A name",
      email: "#{Ecto.UUID.generate()}@exmaple.com",
      token: Ecto.UUID.generate(),
      provider: "github",
      github_id: Ecto.UUID.generate(),
      password: Ecto.UUID.generate(),
      confirmation_token: Ecto.UUID.generate(),
      confirmation_sent_at: Ecto.DateTime.utc(),
      confirmed_at: Ecto.DateTime.utc(),
      terms_accepted_at: Ecto.DateTime.utc()
    }
    |> Map.merge(attrs)
  end

  def create(attrs \\ %{}) do
    params = attrs |> build

    User.changeset(%User{}, params)
    |> Scrumpointer.Repo.insert()
  end
end

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

defmodule Scrumpointer.Factory.List do
  alias Scrumpointer.Web.List

  def build(attrs \\ %{}) do
    %{
      name: Ecto.UUID.generate(),
      type: "sprint",
      user_id: nil,
      project_id: nil
    }
    |> Map.merge(attrs)
  end

  def create(attrs \\ %{}) do
    params = attrs |> build

    List.changeset(%List{}, params)
    |> Scrumpointer.Repo.insert()
  end
end

defmodule Scrumpointer.Factory.Poll do
  alias Scrumpointer.Web.Poll

  def build(attrs \\ %{}) do
    %{
      title: "some name",
      closed: false,
      user_id: nil,
      list_id: nil,
      project_id: nil,
      priority: 0.0,
      description: "Some descr...",
      assignee_id: nil,
      team_id: nil
    }
    |> Map.merge(attrs)
  end

  def create(attrs \\ %{}) do
    params = build(attrs)

    Poll.changeset(%Poll{}, params)
    |> Scrumpointer.Repo.insert()
  end
end

defmodule Scrumpointer.Factory.Comment do
  alias Scrumpointer.Web.Comment

  def build(attrs \\ %{}) do
    %{
      body: "something",
      parent_id: nil,
      user_id: nil,
      poll_id: nil,
      project_id: nil,
      list_id: nil
    }
    |> Map.merge(attrs)
  end

  def create(attrs \\ %{}) do
    params = attrs |> build

    Comment.changeset(%Comment{}, params)
    |> Scrumpointer.Repo.insert()
  end
end
