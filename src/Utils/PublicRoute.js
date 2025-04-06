import {
  redirect
} from "react-router-dom";

export const PublicRoute = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    return redirect("/connect");
  }
  return null;
};