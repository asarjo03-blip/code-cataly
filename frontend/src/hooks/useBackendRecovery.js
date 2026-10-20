import { useEffect, useState } from 'react';
import { OFFLINE_STATUS_EVENT } from '../api/client.js';

export function useBackendRecovery() {
  const [recovery, setRecovery] = useState(0);

  useEffect(() => {
    const handleStatusChange = (event) => {
      if (event.detail?.isOffline === false) {
        setRecovery((current) => current + 1);
      }
    };
    window.addEventListener(OFFLINE_STATUS_EVENT, handleStatusChange);
    return () => window.removeEventListener(OFFLINE_STATUS_EVENT, handleStatusChange);
  }, []);

  return recovery;
}
