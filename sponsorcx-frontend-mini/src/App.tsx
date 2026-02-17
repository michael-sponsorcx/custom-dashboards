import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { Dashboard } from './components/dashboard/Dashboard';
import { CreateGraph } from './components/create_graph/CreateGraph';
import { ManageSchedules } from './components/dashboard/schedule/ManageSchedules';

const App = () => {
  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/configure-graph" element={<CreateGraph />} />
          <Route path="/schedules" element={<ManageSchedules />} />
        </Routes>
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default App;
