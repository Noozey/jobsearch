import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterCard from "./components/register";
import LoginCard from "./components/login";
import Home from "./components/home";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useUser } from "./context/users";
import { FriedsTab } from "./components/Friends";

const App = () => {
  const { isAuthenticate } = useUser();
  console.log(isAuthenticate);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isAuthenticate ? <Navigate to="/home" /> : <LoginCard />}
        />
        <Route
          path="/register"
          element={isAuthenticate ? <Navigate to="/home" /> : <RegisterCard />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/friends" element={<FriedsTab />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
