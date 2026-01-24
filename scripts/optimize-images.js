#!/usr/bin/env node

/**
 * Скрипт для автоматической оптимизации изображений
 * Использует Sharp для оптимизации изображений
 * 
 * Установка: npm install --save-dev sharp
 */

import { readdir, stat, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const PUBLIC_DIR = join(process.cwd(), 'public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG'];
const MAX_SIZE = 500 * 1024; // 500KB

// Проверяем, установлен ли sharp
let sharp;
try {
  const sharpModule = await import('sharp');
  sharp = sharpModule.default;
  console.log('✅ Sharp найден, оптимизация включена\n');
} catch (e) {
  console.error('❌ Sharp не установлен!');
  console.error('📦 Установите: npm install --save-dev sharp');
  console.error('💡 После установки запустите: npm run optimize-images\n');
  process.exit(1);
}

async function getAllImages(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    // Пропускаем node_modules и другие служебные папки
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue;
    }
    
    if (entry.isDirectory()) {
      const subFiles = await getAllImages(fullPath);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (IMAGE_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

async function optimizeImage(filePath) {
  if (!sharp) {
    return { optimized: false, reason: 'Sharp не установлен' };
  }

  try {
    const stats = await stat(filePath);
    const originalSize = stats.size;
    
    // Пропускаем уже маленькие файлы
    if (originalSize < MAX_SIZE) {
      return { optimized: false, reason: 'Файл уже маленький', size: originalSize };
    }

    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Определяем формат вывода
    const format = metadata.format === 'png' ? 'png' : 'jpeg';
    const quality = format === 'png' ? 90 : 85;
    
    // Оптимизируем
    const optimizedBuffer = await image
      .resize(metadata.width > 1920 ? 1920 : null, metadata.height > 1080 ? 1080 : null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .toFormat(format, { quality, progressive: true })
      .toBuffer();
    
    const optimizedSize = optimizedBuffer.length;
    const saved = originalSize - optimizedSize;
    const savedPercent = ((saved / originalSize) * 100).toFixed(1);
    
    // Сохраняем только если сэкономили больше 10%
    if (savedPercent > 10) {
      await writeFile(filePath, optimizedBuffer);
      return {
        optimized: true,
        originalSize,
        optimizedSize,
        saved,
        savedPercent,
      };
    }
    
    return { optimized: false, reason: 'Оптимизация не дала значительного эффекта' };
  } catch (error) {
    return { optimized: false, reason: `Ошибка: ${error.message}` };
  }
}

async function main() {
  console.log('🖼️  Начинаю оптимизацию изображений...\n');
  
  if (!existsSync(PUBLIC_DIR)) {
    console.log('❌ Папка public не найдена');
    process.exit(1);
  }
  
  const images = await getAllImages(PUBLIC_DIR);
  console.log(`📁 Найдено изображений: ${images.length}\n`);
  
  if (images.length === 0) {
    console.log('✅ Изображения не найдены');
    return;
  }
  
  let optimizedCount = 0;
  let totalSaved = 0;
  let skippedCount = 0;
  
  for (const imagePath of images) {
    const relativePath = imagePath.replace(process.cwd(), '').replace(/^\//, '');
    process.stdout.write(`⏳ Обрабатываю: ${relativePath}... `);
    
    const result = await optimizeImage(imagePath);
    
    if (result.optimized) {
      optimizedCount++;
      totalSaved += result.saved;
      console.log(`✅ Сжато на ${result.savedPercent}% (${(result.saved / 1024).toFixed(1)}KB)`);
    } else {
      skippedCount++;
      console.log(`⏭️  ${result.reason}`);
    }
  }
  
  console.log('\n📊 Результаты:');
  console.log(`   ✅ Оптимизировано: ${optimizedCount}`);
  console.log(`   ⏭️  Пропущено: ${skippedCount}`);
  console.log(`   💾 Сэкономлено: ${(totalSaved / 1024).toFixed(1)}KB`);
}

main().catch(console.error);
