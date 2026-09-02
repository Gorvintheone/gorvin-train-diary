defmodule GorvinBackendWeb.WorkoutController do
  use GorvinBackendWeb, :controller

  alias GorvinBackend.Training
  alias GorvinBackend.Training.Workout

  action_fallback GorvinBackendWeb.FallbackController

  def index(conn, _params) do
    workouts = Training.list_workouts()
    render(conn, :index, workouts: workouts)
  end

  def create(conn, %{"workout" => workout_params}) do
    with {:ok, %Workout{} = workout} <- Training.create_workout(workout_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/workouts/#{workout}")
      |> render(:show, workout: workout)
    end
  end

  def show(conn, %{"id" => id}) do
    workout = Training.get_workout!(id)
    render(conn, :show, workout: workout)
  end

  def update(conn, %{"id" => id, "workout" => workout_params}) do
    workout = Training.get_workout!(id)

    with {:ok, %Workout{} = workout} <- Training.update_workout(workout, workout_params) do
      render(conn, :show, workout: workout)
    end
  end

  def delete(conn, %{"id" => id}) do
    workout = Training.get_workout!(id)

    with {:ok, %Workout{}} <- Training.delete_workout(workout) do
      send_resp(conn, :no_content, "")
    end
  end
end
