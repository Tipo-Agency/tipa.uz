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

/**
 * Удаляет все undefined поля из объекта
 * Firestore не поддерживает undefined значения
 */
function removeUndefinedFields<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: any = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}

export async function createLead(data: Omit<LeadData, 'createdAt'>): Promise<string> {
  const firestore = assertDb();
  
  try {
    // Формируем полный номер телефона с кодом страны
    const fullPhone = data.phoneCountryCode + ' ' + data.phone.replace(/\s/g, '');
    
    // Добавляем UTM параметры к данным заявки
    const dataWithUTM = attachUTMToData(data);
    
    const leadData: any = {
      ...dataWithUTM,
      phone: fullPhone, // Сохраняем полный номер с кодом страны
      createdAt: serverTimestamp(),
      status: 'new',
    };

    // Удаляем все undefined поля перед отправкой в Firestore
    const cleanedLeadData = removeUndefinedFields(leadData);

    const docRef = await addDoc(collection(firestore, 'deals'), cleanedLeadData);
    
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
  } catch (error: any) {
    // Детальное логирование ошибки для диагностики
    console.error('❌ Error creating lead:', error);
    
    if (error?.code) {
      console.error('   Error code:', error.code);
    }
    if (error?.message) {
      console.error('   Error message:', error.message);
    }
    if (error?.stack) {
      console.error('   Stack trace:', error.stack);
    }
    
    // Проверяем, что db инициализирован
    if (!db) {
      console.error('   ⚠️ Firestore db is null! Check firebase.ts initialization.');
    }
    
    throw error;
  }
}
