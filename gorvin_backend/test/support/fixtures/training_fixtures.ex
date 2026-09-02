defmodule GorvinBackend.TrainingFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `GorvinBackend.Training` context.
  """

  @doc """
  Generate a workout.
  """
  def workout_fixture(attrs \\ %{}) do
    {:ok, workout} =
      attrs
      |> Enum.into(%{
        client_id: 42,
        client_log: "some client_log",
        date: "some date",
        notes: "some notes",
        rating: 42,
        status: "some status"
      })
      |> GorvinBackend.Training.create_workout()

    workout
  end
end
