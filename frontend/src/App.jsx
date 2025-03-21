import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/parent">Parent</Link></li>
          <li><Link to="/educator">Educator</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/educator" element={<Educator />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
