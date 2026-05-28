import { doc, getDoc, runTransaction, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../firebase';

export async function processTopup(userId: string, packageAmount: number, promoCode?: string) {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await transaction.get(userRef);
      
      const userExists = userSnap.exists();
      let userData: any = userExists ? userSnap.data() : { balance: 0 };
      
      const transactionsCol = collection(db, 'transactions');
      const newTransactionRef = doc(transactionsCol);

      let finalBalance = userData.balance + packageAmount;

      // Now apply all user writes
      if (userExists) {
        transaction.update(userRef, {
          balance: finalBalance,
          updatedAt: serverTimestamp()
        });
      } else {
        const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        transaction.set(userRef, {
          uid: userId,
          email: userId, // free fire id
          referralCode: newReferralCode, // keeping field for compat but ignoring logic
          balance: finalBalance,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        const codeRef = doc(db, 'referralCodes', newReferralCode);
        transaction.set(codeRef, {
          ownerId: userId,
          createdAt: serverTimestamp()
        });
      }
      
      transaction.set(newTransactionRef, {
        userId: userId,
        type: 'purchase',
        amount: packageAmount,
        status: 'completed',
        promoCode: promoCode || null,
        createdAt: serverTimestamp()
      });
    });

    return true;
  } catch (error: any) {
    console.error("Transaction failed: ", error);
    throw new Error(error.message);
  }
}
