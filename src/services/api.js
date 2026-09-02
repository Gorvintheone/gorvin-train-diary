const API_URL = 'http://localhost:4000/api';

export const getWorkouts = async () => {
  const response = await fetch(`${API_URL}/workouts`);
  const data = await response.json();
  return data.data || data;
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  const data = await response.json();
  return data.data || data;
};
