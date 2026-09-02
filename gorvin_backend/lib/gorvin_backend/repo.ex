defmodule GorvinBackend.Repo do
  use Ecto.Repo,
    otp_app: :gorvin_backend,
    adapter: Ecto.Adapters.SQLite3
end
