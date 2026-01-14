/**
 * Transliterate Russian text to URL-friendly slug
 * Converts Russian characters to Latin equivalents
 */

const transliterationMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
};

/**
 * Convert text to URL-friendly slug
 * @param text - Text to convert (Russian or any text)
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  // Convert to lowercase and transliterate
  let slug = text
    .toLowerCase()
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('');
  
  // Replace spaces and special characters with hyphens
  slug = slug
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')        // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
  
  // Limit length to 100 characters
  if (slug.length > 100) {
    slug = slug.substring(0, 100).replace(/-+$/, '');
  }
  
  return slug || 'item'; // Fallback if empty
}

/**
 * Generate slug from title (without ID)
 * @param title - Title text
 * @param id - Item ID (not used, kept for backward compatibility)
 * @returns Slug without ID
 */
export function generateSlug(title: string, id?: string): string {
  return slugify(title);
}
