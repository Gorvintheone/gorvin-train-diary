defmodule GorvinBackend.TrainingTest do
  use GorvinBackend.DataCase

  alias GorvinBackend.Training

  describe "workouts" do
    alias GorvinBackend.Training.Workout

    import GorvinBackend.TrainingFixtures

    @invalid_attrs %{status: nil, date: nil, client_id: nil, notes: nil, rating: nil, client_log: nil}

    test "list_workouts/0 returns all workouts" do
      workout = workout_fixture()
      assert Training.list_workouts() == [workout]
    end

    test "get_workout!/1 returns the workout with given id" do
      workout = workout_fixture()
      assert Training.get_workout!(workout.id) == workout
    end

    test "create_workout/1 with valid data creates a workout" do
      valid_attrs = %{status: "some status", date: "some date", client_id: 42, notes: "some notes", rating: 42, client_log: "some client_log"}

      assert {:ok, %Workout{} = workout} = Training.create_workout(valid_attrs)
      assert workout.status == "some status"
      assert workout.date == "some date"
      assert workout.client_id == 42
      assert workout.notes == "some notes"
      assert workout.rating == 42
      assert workout.client_log == "some client_log"
    end

    test "create_workout/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Training.create_workout(@invalid_attrs)
    end

    test "update_workout/2 with valid data updates the workout" do
      workout = workout_fixture()
      update_attrs = %{status: "some updated status", date: "some updated date", client_id: 43, notes: "some updated notes", rating: 43, client_log: "some updated client_log"}

      assert {:ok, %Workout{} = workout} = Training.update_workout(workout, update_attrs)
      assert workout.status == "some updated status"
      assert workout.date == "some updated date"
      assert workout.client_id == 43
      assert workout.notes == "some updated notes"
      assert workout.rating == 43
      assert workout.client_log == "some updated client_log"
    end

    test "update_workout/2 with invalid data returns error changeset" do
      workout = workout_fixture()
      assert {:error, %Ecto.Changeset{}} = Training.update_workout(workout, @invalid_attrs)
      assert workout == Training.get_workout!(workout.id)
    end

    test "delete_workout/1 deletes the workout" do
      workout = workout_fixture()
      assert {:ok, %Workout{}} = Training.delete_workout(workout)
      assert_raise Ecto.NoResultsError, fn -> Training.get_workout!(workout.id) end
    end

    test "change_workout/1 returns a workout changeset" do
      workout = workout_fixture()
      assert %Ecto.Changeset{} = Training.change_workout(workout)
    end
  end
end
