import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userProfile: any | null;
  identifyGuest: (playerId: string) => Promise<void>;
  logoutGuest: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  userProfile: null,
  identifyGuest: async () => {},
  logoutGuest: () => {}
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestId, setGuestId] = useState<string | null>(localStorage.getItem('guest_id'));

  const logoutGuest = () => {
    localStorage.removeItem('guest_id');
    setGuestId(null);
    setUserProfile(null);
  };

  const identifyGuest = async (playerId: string) => {
    localStorage.setItem('guest_id', playerId);
    setGuestId(playerId);
  };

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const setupProfileListener = (uid: string) => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      return onSnapshot(doc(db, 'users', uid), (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user profile", error);
        setLoading(false);
      });
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        unsubscribeSnapshot = setupProfileListener(currentUser.uid);
      } else if (guestId) {
        unsubscribeSnapshot = setupProfileListener(guestId);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [guestId]);

  return (
    <AuthContext.Provider value={{ user, loading, userProfile, identifyGuest, logoutGuest }}>
      {children}
    </AuthContext.Provider>
  );
}
