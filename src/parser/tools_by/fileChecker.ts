import axios from 'axios';
import PQueue from 'p-queue';
import fs from 'fs/promises';
import path from 'path';

const cheerio = require('cheerio');

interface PageResult {
  url: string;
  isProduct: boolean;
  title?: string;
  price?: string;
  lastModified: string;
  sourceFile: string;
  notFound?: boolean;
}

async function isProductPage(url: string): Promise<Omit<PageResult, 'lastModified' | 'sourceFile'>> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Принимаем и 404 статусы
      }
    });
    if (response.status === 404) {
      return { url, notFound: false, isProduct: false };
    }
    // Проверяем, что получили HTML
    if (!response.data || typeof response.data !== 'string') {
      console.error(`Неверный тип данных для ${url}`);
      return { url, isProduct: false };
    }

    // Проверяем наличие закрывающего тега </html> как индикатор полного HTML
    if (!response.data.includes('</html>')) {
      console.error(`Неполный HTML для ${url}`);
      return { url, isProduct: false };
    }

    let $: cheerio.Root;
    try {
      $ = cheerio.load(response.data);
    } catch (parseError) {
      console.error(`Ошибка парсинга HTML для ${url}:`, parseError instanceof Error ? parseError.message : 'Unknown error');
      return { url, isProduct: false };
    }

    // Проверяем признаки товара

    const hasProductTitle = $('.product__h1').length > 0;
    const hasProductWrap = $('.product__wrap').length > 0;
    const hasProductPrices = $('.product__prices').length > 0;

    const isProduct = hasProductTitle && hasProductWrap && hasProductPrices;

    console.log($('.product__h1').text());
    console.log($('.product__price').text());
    console.log($('.desc').text());
    console.log();
    return {
      url,
      isProduct,
      title: isProduct ? $('.product__h1').text().trim() : undefined,
      price: isProduct ? $('.product__price').text().trim().replace(/\s+/g, ' ') : undefined
    };
  } catch (error) {
    console.error(`Ошибка при проверке ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    return { url, isProduct: false };
  }
}

export async function processAllSitemaps() {
  const sitemapsDir = './parsed_sitemaps';
  const results: PageResult[] = [];
  const queue = new PQueue({ concurrency: 5 }); // Ограничиваем 5 одновременными запросами

  try {
    // Получаем список всех JSON-файлов в папке
    const files = (await fs.readdir(sitemapsDir))
      .filter(file => file.endsWith('.json'));

    if (files.length === 0) {
      console.log('В папке parsed_sitemaps не найдено JSON-файлов');
      return;
    }

    console.log(`Найдено ${files.length} sitemap-файлов для обработки`);

    // Обрабатываем каждый файл
    for (const file of files) {
      const filePath = path.join(sitemapsDir, file);
      const sitemap = JSON.parse(await fs.readFile(filePath, 'utf-8'));

      if (!sitemap.sitemaps || !Array.isArray(sitemap.sitemaps)) {
        console.log(`Файл ${file} не содержит валидных данных sitemap`);
        continue;
      }

      console.log(`Обработка ${file} (${sitemap.sitemaps.length} URL)`);

      // Обрабатываем каждый URL в sitemap
      for (const item of sitemap.sitemaps) {
        queue.add(async () => {
          try {
            const result = await isProductPage(item.url);
            const fullResult: PageResult = {
              ...result,
              lastModified: item.lastModified || 'unknown',
              sourceFile: file
            };
            results.push(fullResult);

            // Выводим прогресс
            const processed = results.length;
            if (result.notFound) {
              return
            }
            console.log(`[${processed}] ${item.url} - ${result.isProduct ? 'ТОВАР' : 'не товар'}`);
          } catch (error) {
            console.error(`Ошибка при обработке ${item.url}:`, error instanceof Error ? error.message : 'Unknown error');
          }
        });
      }
    }

    await queue.onIdle(); // Ждем завершения всех запросов

    // Сохраняем результаты
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsFile = `results_${timestamp}.json`;
    await fs.writeFile(resultsFile, JSON.stringify(results, null, 2));

    // Генерируем отчет
    const productCount = results.filter(r => r.isProduct).length;
    const totalUrls = results.length;

    console.log('\n=== ОТЧЕТ ===');
    console.log(`Обработано файлов: ${files.length}`);
    console.log(`Всего URL: ${totalUrls}`);
    console.log(`Найдено товаров: ${productCount} (${Math.round(productCount/totalUrls*100)}%)`);
    console.log(`Результаты сохранены в ${resultsFile}`);

    // Сохраняем отдельно только товары
    if (productCount > 0) {
      const productsFile = `products_${timestamp}.json`;
      const products = results.filter(r => r.isProduct);
      await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
      console.log(`Список товаров сохранен в ${productsFile}`);
    }

  } catch (error) {
    console.error('Ошибка при обработке sitemaps:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Запускаем процесс
processAllSitemaps().catch(console.error);