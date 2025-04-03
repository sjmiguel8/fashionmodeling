import { useEffect, useState } from 'react';
import { getFirebaseInstance } from '../lib/firebase-config';

export function useFirebaseTest() {
    const initFirebase = async () => {
        const { auth, db } = await getFirebaseInstance();
        // Your firebase test logic here
    };

    return { initFirebase };
}
