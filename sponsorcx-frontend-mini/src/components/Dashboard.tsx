import { Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate('/create-graph')}>
        Add Graph
      </Button>
    </div>
  );
}
