import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { CASES_DATA } from '../constants';
import { CaseStudy } from '../types';

export const getCases = async (): Promise<CaseStudy[]> => {
  if (!db) {
      console.log('Firebase not initialized, returning static cases.');
      return CASES_DATA;
  }

  try {
    const querySnapshot = await getDocs(collection(db, "cases"));
    if (querySnapshot.empty) {
        return CASES_DATA;
    }
    const cases: CaseStudy[] = [];
    querySnapshot.forEach((doc) => {
      // Basic validation or mapping could happen here
      cases.push({ id: doc.id, ...doc.data() } as CaseStudy);
    });
    return cases;
  } catch (error) {
    console.error("Error fetching cases from Firebase:", error);
    return CASES_DATA;
  }
};

export const getCaseById = async (idOrSlug: string): Promise<CaseStudy | undefined> => {
  if (!db) {
    return CASES_DATA.find(c => c.id === idOrSlug || c.slug === idOrSlug);
  }

  try {
    // 1. Try to fetch by ID directly
    const docRef = doc(db, "cases", idOrSlug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CaseStudy;
    } 

    // 2. If not found by ID, try to find by slug (requires a query, but keeping it simple for now)
    // For this simple implementation, we'll just fall back to static if direct ID fails, 
    // or you can implement a 'where' query here.
    return CASES_DATA.find(c => c.id === idOrSlug || c.slug === idOrSlug);
    
  } catch (error) {
    console.error("Error fetching case details:", error);
    return CASES_DATA.find(c => c.id === idOrSlug || c.slug === idOrSlug);
  }
};