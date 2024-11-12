import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layout";
import User from "./pages/User";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Users />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
