defmodule GorvinBackendWeb.WorkoutControllerTest do
  use GorvinBackendWeb.ConnCase

  import GorvinBackend.TrainingFixtures
  alias GorvinBackend.Training.Workout

  @create_attrs %{
    status: "some status",
    date: "some date",
    client_id: 42,
    notes: "some notes",
    rating: 42,
    client_log: "some client_log"
  }
  @update_attrs %{
    status: "some updated status",
    date: "some updated date",
    client_id: 43,
    notes: "some updated notes",
    rating: 43,
    client_log: "some updated client_log"
  }
  @invalid_attrs %{status: nil, date: nil, client_id: nil, notes: nil, rating: nil, client_log: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all workouts", %{conn: conn} do
      conn = get(conn, ~p"/api/workouts")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create workout" do
    test "renders workout when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/workouts", workout: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/workouts/#{id}")

      assert %{
               "id" => ^id,
               "client_id" => 42,
               "client_log" => "some client_log",
               "date" => "some date",
               "notes" => "some notes",
               "rating" => 42,
               "status" => "some status"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/workouts", workout: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update workout" do
    setup [:create_workout]

    test "renders workout when data is valid", %{conn: conn, workout: %Workout{id: id} = workout} do
      conn = put(conn, ~p"/api/workouts/#{workout}", workout: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/workouts/#{id}")

      assert %{
               "id" => ^id,
               "client_id" => 43,
               "client_log" => "some updated client_log",
               "date" => "some updated date",
               "notes" => "some updated notes",
               "rating" => 43,
               "status" => "some updated status"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, workout: workout} do
      conn = put(conn, ~p"/api/workouts/#{workout}", workout: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete workout" do
    setup [:create_workout]

    test "deletes chosen workout", %{conn: conn, workout: workout} do
      conn = delete(conn, ~p"/api/workouts/#{workout}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/workouts/#{workout}")
      end
    end
  end

  defp create_workout(_) do
    workout = workout_fixture()

    %{workout: workout}
  end
end
