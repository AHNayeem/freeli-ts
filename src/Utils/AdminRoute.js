import { redirect } from "react-router-dom";

export const AdminRoute = async () => {
  const role = localStorage.getItem('role');

  if (role !== "Admin") {
    return redirect("/connect");
  }

  return null;
};
