import '@xyflow/react/dist/style.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QueryPage from './pages/QueryPage';
import References from './pages/References';
import Flowchart from './pages/Flowchart';


export default function App() {

  return (
    <Router>
      <Routes>
        {/* Route for the Query Page */}
        <Route path="/" element={<QueryPage />} />
        
        {/* Route for the References Page */}
        <Route path="/references" element={<References />} />
        
        {/* Route for the Flowchart Page */}
        <Route path="/flowchart" element={<Flowchart />} />
      </Routes>
    </Router>
  );
}

