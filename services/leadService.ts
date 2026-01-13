import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { attachUTMToData } from '../lib/utmTracking';

export interface LeadData {
  firstName: string;
  lastName: string;
  phone: string;
  phoneCountryCode: string; // +998, +7 и т.д.
  task?: string; // Необязательное поле
  sourceSection?: string; // Секция откуда отправлена заявка
  createdAt: any; // serverTimestamp()
  status?: string; // 'new', 'contacted', 'in_progress', 'closed'
  // UTM параметры (опционально)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const assertDb = () => {
  if (!db) {
    console.error('❌ Firestore is not initialized. Check firebase.ts configuration.');
    throw new Error('Firestore is not initialized');
  }
  return db;
};

export async function createLead(data: Omit<LeadData, 'createdAt'>): Promise<string> {
  const firestore = assertDb();
  
  try {
    // Формируем полный номер телефона с кодом страны
    const fullPhone = data.phoneCountryCode + ' ' + data.phone.replace(/\s/g, '');
    
    // Добавляем UTM параметры к данным заявки
    const dataWithUTM = attachUTMToData(data);
    
    const leadData: LeadData = {
      ...dataWithUTM,
      phone: fullPhone, // Сохраняем полный номер с кодом страны
      createdAt: serverTimestamp(),
      status: 'new',
    };

    const docRef = await addDoc(collection(firestore, 'deals'), leadData);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Lead created successfully with ID:', docRef.id);
      console.log('📋 Lead data:', {
        firstName: leadData.firstName,
        lastName: leadData.lastName,
        phone: leadData.phone,
        sourceSection: leadData.sourceSection,
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating lead:', error);
    throw error;
  }
}
