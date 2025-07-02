import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FlightBoard } from './features/flightBoard/FlightBoard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/flight-board" element={
          <ProtectedRoute>
            <FlightBoard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;