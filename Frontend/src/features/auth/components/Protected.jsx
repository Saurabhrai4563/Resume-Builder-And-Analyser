import { useAuth } from "../hooks/useAuth";

import React from "react";
import { Navigate } from "react-router";
export default function Protected({ children }) {
  console.log(children);
  const { loading, user } = useAuth();
  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }
  if (!user) {
    return <Navigate to={"/login"}></Navigate>;
  }
  return children;
}
