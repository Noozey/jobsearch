import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterCard from "./components/register.tsx";
import LoginCard from "./components/login.tsx";
import Home from "./components/home.tsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginCard />} />
        <Route path="/register" element={<RegisterCard />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
