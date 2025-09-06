import { Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
// import Login from './pages/Login'; // Assuming you have a Login component

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Registration />} />
      {/* <Route path="/login" element={<Login />} /> */}
      {/* Add more routes here */}
    </Routes>
  );
};

export default AppRoutes;