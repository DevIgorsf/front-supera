import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Transfers from './pages/Transfers';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/transfers/:id" element={<Transfers/>} />
    </Routes>
  );
}

export default App;
