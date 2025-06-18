import axios from 'axios';
import { parseStringPromise } from 'xml2js';

interface SitemapIndex {
  sitemaps: SitemapEntry[];
}

interface SitemapEntry {
  url: string;
  lastModified: string;
}

export async function getSitemapIndex(url: string): Promise<SitemapIndex> {
  try {
    const response = await axios.get(url);
    const xml = response.data;

    // Парсим XML в JSON
    const result = await parseStringPromise(xml);

    // Если XML является индексом сайтмапов
    if (result.sitemapindex) {
      const sitemaps = result.sitemapindex.sitemap?.map((s: any) => ({
        url: s.loc[0],
        lastModified: s.lastmod ? s.lastmod[0] : null
      }));
      return { sitemaps };
    }

    // Если XML является обычным сайтмапом
    if (result.urlset) {
      const urls = result.urlset.url?.map((u: any) => ({
        url: u.loc[0],
        lastModified: u.lastmod ? u.lastmod[0] : null
      }));
      return { sitemaps: urls };
    }

    throw new Error('Неизвестный формат XML сайтмапа');
  } catch (error) {
    console.error('Ошибка при парсинге сайтмапа:', error);
    throw error;
  }
}

export async function getAllSitemaps(sitemapIndexUrl: string): Promise<SitemapIndex> {
  try {
    const index = await getSitemapIndex(sitemapIndexUrl);

    const allSitemaps: SitemapEntry[] = [];

    for (const sitemap of index.sitemaps) {
      try {
        const content = await getSitemapIndex(sitemap.url);
        if (Array.isArray(content.sitemaps)) {
          allSitemaps.push(...content.sitemaps);
        }
      } catch (error) {
        console.error(`Не удалось получить сайтмап ${sitemap.url}:`, error);
      }
    }

    return { sitemaps: allSitemaps };
  } catch (error) {
    console.error('Ошибка при получении всех сайтмапов:', error);
    throw error;
  }
}