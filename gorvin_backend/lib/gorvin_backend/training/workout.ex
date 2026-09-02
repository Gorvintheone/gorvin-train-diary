defmodule GorvinBackend.Training.Workout do
  use Ecto.Schema
  import Ecto.Changeset

  schema "workouts" do
    field :client_id, :integer
    field :date, :string
    field :notes, :string
    field :status, :string
    field :rating, :integer
    field :client_log, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(workout, attrs) do
    workout
    |> cast(attrs, [:client_id, :date, :notes, :status, :rating, :client_log])
    |> validate_required([:client_id, :date, :notes, :status, :rating, :client_log])
  end
end
