import { db } from '@/config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { SavedAd } from '@/stores/index';

export const saveAdToFirebase = async (userId: string, ad: Omit<SavedAd, 'id'>) => {
  try {
    console.log('Starting Firebase save operation for user:', userId);
    const userAdsRef = collection(db, 'users', userId, 'savedAds');
    const docRef = await addDoc(userAdsRef, {
      ...ad,
      timestamp: Date.now()
    });
    return { ...ad, id: docRef.id };
  } catch (error) {
    console.error('Error saving ad to Firebase:', error);
    throw error;
  }
};

export const getUserAds = async (userId: string): Promise<SavedAd[]> => {
  try {
    const userAdsRef = collection(db, 'users', userId, 'savedAds');
    const snapshot = await getDocs(userAdsRef);
    return snapshot.docs.map(doc => ({
      ...(doc.data() as Omit<SavedAd, 'id'>),
      id: doc.id
    }));
  } catch (error) {
    console.error('Error getting user ads:', error);
    throw error;
  }
};

export const deleteAdFromFirebase = async (userId: string, adId: string): Promise<void> => {
  try {
    const adRef = doc(db, 'users', userId, 'savedAds', adId);
    await deleteDoc(adRef);
  } catch (error) {
    console.error('Error deleting ad from Firebase:', error);
    throw error;
  }
};