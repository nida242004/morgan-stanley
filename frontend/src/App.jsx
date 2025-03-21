import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPage from './pages/AdminPage/AdminPage';

function Home() {
  return <h1>Home Page</h1>;
}

function Parent() {
  return <h1>Parent Dashboard</h1>;
}

function Educator() {
  return <h1>Educator Dashboard</h1>;
}

function Admin() {
  return <h1>Admin Panel</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/educator" element={<Educator />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
