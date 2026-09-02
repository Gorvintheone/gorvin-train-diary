defmodule GorvinBackendWeb.Router do
  use GorvinBackendWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", GorvinBackendWeb do
    pipe_through :api

    resources "/users", UserController, except: [:new, :edit]
    resources "/workouts", WorkoutController, except: [:new, :edit]
  end

  if Application.compile_env(:gorvin_backend, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev", GorvinBackendWeb do
      pipe_through [:fetch_session, :protect_from_forgery]

      live_dashboard "/dashboard", metrics: GorvinBackendWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end