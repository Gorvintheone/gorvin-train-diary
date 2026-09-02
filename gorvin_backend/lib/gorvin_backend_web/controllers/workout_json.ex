defmodule GorvinBackendWeb.WorkoutJSON do
  alias GorvinBackend.Training.Workout

  @doc """
  Renders a list of workouts.
  """
  def index(%{workouts: workouts}) do
    %{data: for(workout <- workouts, do: data(workout))}
  end

  @doc """
  Renders a single workout.
  """
  def show(%{workout: workout}) do
    %{data: data(workout)}
  end

  defp data(%Workout{} = workout) do
    %{
      id: workout.id,
      client_id: workout.client_id,
      date: workout.date,
      notes: workout.notes,
      status: workout.status,
      rating: workout.rating,
      client_log: workout.client_log
    }
  end
end
