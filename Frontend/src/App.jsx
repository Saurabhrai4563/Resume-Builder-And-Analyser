import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.contex.jsx";
function App() {
  return (
    <div>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
