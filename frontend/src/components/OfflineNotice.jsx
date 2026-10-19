import { useEffect, useState } from 'react';
import { OFFLINE_STATUS_EVENT } from '../api/client.js';
import { readJson } from '../utils/storage.js';
import './OfflineNotice.css';

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(() => readJson('offlineDemo', false));

  useEffect(() => {
    const updateStatus = () => setIsOffline(readJson('offlineDemo', false));
    window.addEventListener(OFFLINE_STATUS_EVENT, updateStatus);
    window.addEventListener('storage', updateStatus);
    return () => {
      window.removeEventListener(OFFLINE_STATUS_EVENT, updateStatus);
      window.removeEventListener('storage', updateStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <aside className="offline-notice" role="status">
      <span>
        <strong>Offline demo mode.</strong> Sample data is shown; changes are saved only on this device.
      </span>
      <button type="button" onClick={() => window.location.reload()}>
        Retry
      </button>
    </aside>
  );
}
