import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./Layout";
import Users from "./pages/Users";
import UserItem from "./pages/User";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Users />} />
          <Route path="/user/:id" element={<UserItem />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
