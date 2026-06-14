import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.contex.jsx";
function App() {
  return (
    <div>
      <AuthProvider></AuthProvider>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
