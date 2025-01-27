import '@xyflow/react/dist/style.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QueryPage from './pages/QueryPage';
import Flowchart from './pages/Flowchart';
import CuratedWorkflow from './pages/CuratedWorkflow';


export default function App() {

  return (
    <Router>
      <Routes>
        {/* Route for the Query Page */}
        <Route path="/" element={<QueryPage />} />
        
        {/* Route for the References Page */}
        <Route path="/curatedworkflow" element={<CuratedWorkflow />} />
        
        {/* Route for the Flowchart Page */}
        <Route path="/flowchart" element={<Flowchart />} />
      </Routes>
    </Router>
  );
}

