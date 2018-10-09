defmodule ScrumpointerWeb.Router do
  use ScrumpointerWeb, :router
  use Coherence.Router
  use Plug.ErrorHandler
  use Sentry.Plug

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
    plug(ScrumpointerWeb.Plugs.ScrumlabRedirect)
    plug(Coherence.Authentication.Session)
    plug(Ueberauth)
  end

  pipeline :protected do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
    plug(ScrumpointerWeb.Plugs.ScrumlabRedirect)
    plug(Coherence.Authentication.Session, protected: true)
  end

  pipeline :admin_only do
    plug(ScrumpointerWeb.Plugs.EnsureAdmin)
  end

  scope "/" do
    pipe_through(:browser)
    coherence_routes()
  end

  scope "/" do
    pipe_through(:protected)
    coherence_routes(:protected)
    # not yet used
    resources("/repositories", RepositoryController)
    get("/app/*path", ScrumpointerWeb.AppController, :show)
  end

  pipeline :api do
    plug(:accepts, ["json"])
    plug(:fetch_session)
    plug(:put_secure_browser_headers)
    plug(ScrumpointerWeb.Plugs.ScrumlabRedirect)
    plug(Coherence.Authentication.Session, protected: true)
  end

  scope "/api", ScrumpointerWeb.Api do
    pipe_through(:api)
    get("/projects", Project, :index)
    get("/account", Account, :show)

    scope "/admin", Admin do
      pipe_through(:admin_only)
      get("/dashboard", Dashboard, :index)
    end

    delete("/account", Account, :delete)
    get("/github/repos", Github, :repos)
    get("/projects/:project_id", Project, :show)
    post("/projects/create", Project, :create)
    patch("/projects/:project_id/update", Project, :update)
    get("/projects/:project_id/issues", Story, :index)
    get("/projects/:project_id/search_stories", SearchStories, :index)
    # should be deleted
    patch("/projects/:project_id/issues/:issue_id/add_to_sprint", Story, :add_to_sprint)
    patch("/projects/:project_id/stories/:story_id/add_to_sprint", Story, :add_to_sprint)
    get("/projects/:project_id/sprints", Sprint, :index)
    post("/projects/:project_id/sprints/new", Sprint, :create)
    post("/projects/:project_id/sprints/:sprint_id/delete", Sprint, :delete)
    delete("/projects/:project_id/issues/:issue_id/delete", Story, :delete)
    get("/projects/:project_id/issues/:issue_id/entries", Entry, :index)
    get("/projects/:project_id/issues/:issue_id/vote", Story, :vote)
    post("/projects/:project_id/issues/new", Story, :create)
    delete("/projects/:project_id/delete", Project, :delete)

    scope "/projects/:project_id/stories/:story_id/" do
      get("/", Story, :show)
      patch("/assign_to_user/:user_id", Story, :assign_to_user)
      patch("/assign_to_user/", Story, :assign_to_user)
      patch("/assign_to_me", Story, :assign_to_me)
      patch("/rank_between", Story, :rank_between)
      patch("/rank_first", Story, :rank_first)
      patch("/rank_last", Story, :rank_last)
      # call twice to reopen
      patch("/close", Story, :close!)
      patch("/update", Story, :update)
      post("/watch", StoryWatchers, :watch)
      post("/unwatch", StoryWatchers, :unwatch)
      get("/watchers", StoryWatchers, :watchers)
      post("/upload", Upload, :create)
      get("/attachments", Upload, :index)
      delete("/attachments/:attachment_id", Upload, :delete)
    end

    scope "/projects/:project_id/sprints/:sprint_id/" do
      get("/", Sprint, :show)
      get("/burndownchart", Burndownchart, :show)
      # call twice to reopen
      patch("/close", Sprint, :close!)
    end

    scope "/projects/:project_id/" do
      get("/team", Team, :index)
      get("/feedback", Feedback, :index)
      post("/add_member/:user_email", ProjectUsers, :add)
      patch("/upgrade/", Subscription, :create)
      delete("/remove_member/:user_email", ProjectUsers, :remove)
      get("/members", ProjectUsers, :index)
    end

    scope "/users/" do
      post("/logout", User, :logout)
    end

    scope "/projects/:project_id/stories/:poll_id/" do
      get("/comments", Comment, :index)
      post("/comments", Comment, :create)
      delete("/comments/:comment_id", Comment, :delete)
    end
  end

  scope "/", ScrumpointerWeb do
    pipe_through(:browser)
    get("/", PageController, :index)
    # Add public routes below
  end

  scope "/auth", ScrumpointerWeb do
    pipe_through(:browser)

    get("/:provider", AuthController, :request)
    get("/:provider/callback", AuthController, :callback)
  end

  scope "/projects/:project", ScrumpointerWeb do
    pipe_through(:protected)

    get("/", PollController, :index)
    resources("/stories", PollController)
    resources("/sprints", ListController)
  end

  scope "/dashboard", ScrumpointerWeb do
    pipe_through(:protected)

    get("/", TeamController, :index)
    resources("/projects", ProjectController)
  end
end
