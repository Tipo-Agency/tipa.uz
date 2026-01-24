import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { STATIC_CASES } from "../data/cases";
import { STATIC_NEWS } from "../data/news";
import { STATIC_TAGS } from "../data/tags";

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
  imageUrl?: string; // Главное изображение
  galleryImages?: string[]; // Дополнительные изображения для галереи
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
    console.log("📦 Collections to load: partnerLogos (news, cases, tags are static)");
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

  // News and Cases are now static - loaded from local files
  const news: News[] = STATIC_NEWS;
  const cases: CaseItem[] = STATIC_CASES;
  const tags: Tag[] = STATIC_TAGS;

  return { partnerLogos, news, cases, tags };
}

