import { useEffect, useState } from 'react';
import { testConnection } from '../lib/firebase-config';

export function useFirebaseTest() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    testConnection().then(connected => {
      setIsConnected(connected);
      console.log('Firebase connection status:', connected);
    });
  }, []);

  return isConnected;
}
