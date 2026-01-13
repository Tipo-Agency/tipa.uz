/**
 * UTM Tracking utility
 * Парсит UTM-метки из URL и сохраняет их для последующего использования
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const UTM_STORAGE_KEY = 'tipa_utm_params';
const UTM_EXPIRY_DAYS = 30; // UTM параметры хранятся 30 дней

/**
 * Парсит UTM параметры из URL
 */
export function parseUTMFromURL(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};
  
  const utmKeys: (keyof UTMParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
    }
  });
  
  return utm;
}

/**
 * Сохраняет UTM параметры в localStorage с датой сохранения
 */
export function saveUTMParams(params: UTMParams): void {
  if (typeof window === 'undefined' || Object.keys(params).length === 0) return;
  
  try {
    const data = {
      params,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save UTM params:', error);
  }
}

/**
 * Получает сохраненные UTM параметры (если они не истекли)
 */
export function getStoredUTMParams(): UTMParams | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    const savedDate = new Date(data.timestamp);
    const now = new Date();
    const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Если параметры истекли, удаляем их
    if (daysDiff > UTM_EXPIRY_DAYS) {
      localStorage.removeItem(UTM_STORAGE_KEY);
      return null;
    }
    
    return data.params;
  } catch (error) {
    console.error('Failed to get stored UTM params:', error);
    return null;
  }
}

/**
 * Инициализация UTM трекинга
 * Вызывается при загрузке приложения
 * - Если в URL есть UTM параметры - сохраняет их
 * - Если нет - использует сохраненные (если они не истекли)
 */
export function initUTMTracking(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const urlParams = parseUTMFromURL();
  
  // Если в URL есть UTM параметры - сохраняем их
  if (Object.keys(urlParams).length > 0) {
    saveUTMParams(urlParams);
    return urlParams;
  }
  
  // Если нет - возвращаем сохраненные
  return getStoredUTMParams() || {};
}

/**
 * Получает текущие UTM параметры (из URL или из хранилища)
 */
export function getCurrentUTMParams(): UTMParams {
  const urlParams = parseUTMFromURL();
  if (Object.keys(urlParams).length > 0) {
    return urlParams;
  }
  return getStoredUTMParams() || {};
}

/**
 * Добавляет UTM параметры к объекту данных (например, для формы заявки)
 */
export function attachUTMToData(data: Record<string, any>): Record<string, any> {
  const utm = getCurrentUTMParams();
  return {
    ...data,
    ...utm,
  };
}

/**
 * Форматирует UTM параметры для логирования/отображения
 */
export function formatUTMForDisplay(params: UTMParams): string {
  const parts: string[] = [];
  if (params.utm_source) parts.push(`Source: ${params.utm_source}`);
  if (params.utm_medium) parts.push(`Medium: ${params.utm_medium}`);
  if (params.utm_campaign) parts.push(`Campaign: ${params.utm_campaign}`);
  if (params.utm_term) parts.push(`Term: ${params.utm_term}`);
  if (params.utm_content) parts.push(`Content: ${params.utm_content}`);
  return parts.join(' | ') || 'No UTM';
}
