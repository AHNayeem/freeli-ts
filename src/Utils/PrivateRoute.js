import {
  redirect
} from "react-router-dom";

export const PrivateRoute = async () => {
  const token = localStorage.getItem('token');
  // console.log(7,token)
  if (!token) {
    return redirect("/login");
  }
  return null;
};