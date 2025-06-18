import fs from 'fs/promises';
import path from 'path';
import { getAllSitemaps } from '../utils/sitemapCollector';

// Конфигурация
const MAX_ENTRIES_PER_FILE = 1000;
const OUTPUT_DIR = path.join(process.cwd(), 'parsed_sitemaps');

async function saveSitemapsInChunks(sitemaps: any[]) {
  // Создаем директорию, если её нет
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const totalFiles = Math.ceil(sitemaps.length / MAX_ENTRIES_PER_FILE);

  for (let i = 0; i < totalFiles; i++) {
    const startIdx = i * MAX_ENTRIES_PER_FILE;
    const endIdx = startIdx + MAX_ENTRIES_PER_FILE;
    const chunk = sitemaps.slice(startIdx, endIdx);

    const filename = `sitemaps-${timestamp}-part-${i + 1}-of-${totalFiles}.json`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    await fs.writeFile(outputPath, JSON.stringify({ sitemaps: chunk }, null, 2));
    console.log(`✅ Файл сохранен: ${filename} (записей: ${chunk.length})`);
  }
}

(async () => {
  try {
    const sitemapIndexUrl = 'https://th-tool.by/sitemap.xml';
    const { sitemaps } = await getAllSitemaps(sitemapIndexUrl);

    if (!sitemaps || sitemaps.length === 0) {
      console.log('⚠️ Нет данных для сохранения');
      return;
    }

    console.log(`📊 Всего записей: ${sitemaps.length}`);

    await saveSitemapsInChunks(sitemaps);
    console.log('🎉 Все файлы успешно сохранены!');

  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
})();
