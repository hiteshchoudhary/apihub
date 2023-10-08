import axios from "axios";

axios.defaults.baseURL = `${import.meta.env.VITE_SERVER_URL}`;

export const getTodos = () => {
  return axios.get("/todos");
};

export const deleteTodo = (todoId: string) => {
  return axios.delete(`/todos/${todoId}`);
};

export const toggleCheck = (todoId: string) => {
  return axios.patch(`/todos/toggle/status/${todoId}`);
};

export const editTodo = (
  todoId: string,
  { title, description }: { title: string; description: string }
) => {
  return axios.patch(
    `/todos/${todoId}`,
    { title, description },
    { headers: { "Content-Type": "application/json" } }
  );
};

export const createTodo = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return axios.post(
    "/todos",
    { title, description },
    { headers: { "Content-Type": "application/json" } }
  );
};
