import { signInAnonymously, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { auth, db } from '../firebase';

function generateReferralCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

let isLoggingIn = false;

export async function loginWithFreeFireId(freeFireId: string) {
  if (isLoggingIn || !freeFireId.trim()) return null;
  isLoggingIn = true;
  
  try {
    // We use the freeFireId itself as the UID
    const uid = freeFireId;
    
    // Check if user profile exists
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create user profile
      let isUniqueCode = false;
      let newReferralCode = '';
      
      // Basic uniqueness check loop
      while (!isUniqueCode) {
        newReferralCode = generateReferralCode();
        const codeSnap = await getDoc(doc(db, 'referralCodes', newReferralCode));
        if (!codeSnap.exists()) {
          isUniqueCode = true;
        }
      }
      
      const batch = writeBatch(db);
      
      batch.set(userRef, {
        uid: uid,
        email: freeFireId, 
        referralCode: newReferralCode,
        balance: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      batch.set(doc(db, 'referralCodes', newReferralCode), {
        ownerId: uid,
        createdAt: serverTimestamp()
      });
      
      await batch.commit();
    }
    return uid;
  } catch (error: any) {
    console.error('Error identifying user', error);
    return null;
  } finally {
    isLoggingIn = false;
  }
}

export async function logout() {
  await signOut(auth);
}
