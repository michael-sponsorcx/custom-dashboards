import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/dashboard/Dashboard';
import { CreateGraph } from './components/create_graph/CreateGraph';
import { ManageSchedules } from './components/dashboard/schedule/ManageSchedules';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/configure-graph" element={<CreateGraph />} />
        <Route path="/schedules" element={<ManageSchedules />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
