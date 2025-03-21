import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPage from './pages/AdminPage/AdminPage';
import SignUp from './pages/SignUp/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/SignUp" element={<SignUp/>}/>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
