import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from './pages/AdminPage/AdminPage';
import SignIn from './pages/SignIn/SignIn';
import ChildDashboard from './pages/ChildDashboard/ChildDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';
import Home from './pages/Home/Home';
import BookSession from './pages/BookSession/BookSession';
import ApplyEducator from './pages/ApplyEducator/ApplyEducator';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/Signin" element={<SignIn />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/child-dashboard/:childName" element={<ChildDashboard />} />
        <Route path="/employee-dashboard/:educatorID" element={<EmployeeDashboard />} />
        <Route path='/appointment' element={<BookSession/>}/>
        <Route path='/apply' element={<ApplyEducator/>}/>
      </Routes>
    </Router></>
  );
}

export default App;
