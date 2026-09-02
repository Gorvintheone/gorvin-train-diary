defmodule GorvinBackend.Repo.Migrations.CreateWorkouts do
  use Ecto.Migration

  def change do
    create table(:workouts) do
      add :client_id, :integer
      add :date, :string
      add :notes, :text
      add :status, :string
      add :rating, :integer
      add :client_log, :text

      timestamps(type: :utc_datetime)
    end
  end
end
