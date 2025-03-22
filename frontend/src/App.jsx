import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from './pages/AdminPage/AdminPage';
import SignUp from './pages/SignUp/SignUp';
import ChildDashboard from './pages/ChildDashboard/ChildDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import Home from './pages/Home/Home';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/child-dashboard/:childName" element={<ChildDashboard />} />
        <Route path="/employee-dashboard/:educatorID" element={<EmployeeDashboard />} />
      </Routes>
    </Router></>
  );
}

export default App;
