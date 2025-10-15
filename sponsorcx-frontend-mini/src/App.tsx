import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { CreateGraph } from './components/CreateGraph';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-graph" element={<CreateGraph />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
