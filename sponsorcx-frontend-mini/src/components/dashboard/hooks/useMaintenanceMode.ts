import { useState, useEffect } from 'react';
import { isFeatureEnabled } from '../../../api/app/featureFlags/featureFlags';

export const useMaintenanceMode = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const isEnabled = await isFeatureEnabled('dashboard_maintenance');
        setEnabled(isEnabled);
      } catch (err) {
        console.error('Failed to check maintenance mode:', err);
        // Fail open — assume not in maintenance
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenance();
  }, []);

  return { enabled, loading };
};
