import { Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login'; // Assuming you have a Login component

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      {/* Add more routes here */}
      <Route path="/landing" element={<LandingPage/>}/>
    </Routes>
  );
};

export default AppRoutes;