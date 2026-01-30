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

export async function getSiteData(): Promise<SiteData> {
  const news: News[] = STATIC_NEWS;
  const cases: CaseItem[] = STATIC_CASES;
  const tags: Tag[] = STATIC_TAGS;

  let partnerLogos: PartnerLogo[] = [];
  if (db) {
    try {
      const logosSnapshot = await getDocs(collection(db, "partnerLogos"));
      partnerLogos = logosSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<PartnerLogo, "id">),
        }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("Partner logos load failed, using empty list:", error);
      }
    }
  }

  return { partnerLogos, news, cases, tags };
}

