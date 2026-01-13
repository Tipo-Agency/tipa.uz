import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export interface PartnerLogo {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  excerpt?: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
}

export interface CaseItem {
  id: string;
  title?: string; // Опциональное, можно использовать description как fallback
  description: string;
  imageUrl?: string;
  clientName?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  tags?: string[]; // Опциональное
  order?: number; // Опциональное
  published: boolean;
  createdAt?: string;
}

export interface SiteData {
  partnerLogos: PartnerLogo[];
  news: News[];
  cases: CaseItem[];
  tags: Tag[];
}

const assertDb = () => {
  if (!db) {
    console.error("❌ Firestore is not initialized. Check firebase.ts configuration.");
    throw new Error("Firestore is not initialized");
  }
  return db;
};

export async function getSiteData(): Promise<SiteData> {
  const firestore = assertDb();
  
  if (process.env.NODE_ENV === 'development') {
    console.log("🔍 Attempting to load data from Firestore...");
    console.log("📦 Collections to load: partnerLogos, news, cases, tags");
  }

  // Partner logos
  let partnerLogos: PartnerLogo[] = [];
  try {
    const logosSnapshot = await getDocs(collection(firestore, "partnerLogos"));
    partnerLogos = logosSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PartnerLogo, "id">),
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error: any) {
    console.error("❌ Error loading partner logos:", error);
    if (error?.code === 'permission-denied') {
      console.error("🔒 PERMISSION DENIED: Firestore rules need to allow public read access.");
      console.error("📝 Add this to Firestore Rules:");
      console.error(`
        match /partnerLogos/{document=**} {
          allow read: if true;
        }
      `);
    }
  }

  // News: only published, newest first (by publishedAt/createdAt)
  let news: News[] = [];
  try {
    const newsSnapshot = await getDocs(collection(firestore, "news"));
    news = newsSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<News, "id">),
      }))
      .filter((item) => item.published === true)
      .sort((a, b) => {
        const aDate = new Date(a.publishedAt || a.createdAt || "").getTime();
        const bDate = new Date(b.publishedAt || b.createdAt || "").getTime();
        return (isNaN(bDate) ? 0 : bDate) - (isNaN(aDate) ? 0 : aDate);
      });
  } catch (error: any) {
    console.error("❌ Error loading news:", error);
    if (error?.code === 'permission-denied') {
      console.error("🔒 PERMISSION DENIED: Firestore rules need to allow public read access.");
    }
  }

  // Cases: only published, ordered by `order` asc
  let cases: CaseItem[] = [];
  try {
    const casesSnapshot = await getDocs(collection(firestore, "cases"));
    
    const allCases = casesSnapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Нормализуем published - может быть boolean, строка "true"/"false", или undefined
      const published = data.published === true || data.published === "true" || data.published === 1;
      
      return {
        id: doc.id,
        title: data.title || undefined,
        description: data.description || "",
        imageUrl: data.imageUrl || undefined,
        clientName: data.clientName || undefined,
        websiteUrl: data.websiteUrl || undefined,
        instagramUrl: data.instagramUrl || undefined,
        tags: data.tags || [],
        order: data.order ?? 0,
        published: published,
        createdAt: data.createdAt || undefined,
      } as CaseItem;
    });
    
    cases = allCases
      .filter((item) => item.published === true)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error: any) {
    console.error("❌ Error loading cases:", error);
    if (error?.code === 'permission-denied') {
      console.error("🔒 PERMISSION DENIED: Firestore rules need to allow public read access.");
      console.error("📝 Add this to Firestore Rules:");
      console.error(`
        match /cases/{document=**} {
          allow read: if true;
        }
      `);
    }
  }

  // Tags
  let tags: Tag[] = [];
  try {
    const tagsSnapshot = await getDocs(collection(firestore, "tags"));
    tags = tagsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Tag, "id">),
    }));
  } catch (error: any) {
    console.error("❌ Error loading tags:", error);
    if (error?.code === 'permission-denied') {
      console.error("🔒 PERMISSION DENIED: Firestore rules need to allow public read access.");
    }
  }

  return { partnerLogos, news, cases, tags };
}

