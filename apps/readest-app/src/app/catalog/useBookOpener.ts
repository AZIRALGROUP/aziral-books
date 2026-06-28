'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useEnv } from '@/context/EnvContext';
import { useLibraryStore } from '@/store/libraryStore';
import { downloadFile } from '@/libs/storage';
import { navigateToReader } from '@/utils/nav';
import { probeFilename } from '../opds/utils/opdsReq';
import type { CatalogBook } from './catalogModel';

const CATALOG_API = 'https://books.aziral.com/api/v1';

/**
 * Opens a catalogue book straight in the reader: resolves the exact EPUB for
 * this book id, downloads + imports it into the library (transparently, so the
 * user never has to hunt through an OPDS search list or tap "Скачать"), then
 * navigates to the reader. importBook dedups by hash, so re-opening an
 * already-saved book just reopens it and keeps reading progress.
 *
 * Shared by the catalogue page, the home discovery cards, and the library's
 * "Подборка для вас" strip so every "read" entry point behaves identically.
 */
export function useBookOpener() {
  const router = useRouter();
  const { appService } = useEnv();
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const open = useCallback(
    async (book: CatalogBook) => {
      if (!appService || openingId) return;
      setErrorId(null);
      setOpeningId(book.id);
      try {
        // Resolve the direct EPUB url for this exact book; fall back to the
        // OPDS download route (302 → EPUB) if the detail endpoint is down.
        let url = `${CATALOG_API}/opds/books/${book.id}/download`;
        try {
          const r = await fetch(`${CATALOG_API}/books/${book.id}`, { cache: 'no-store' });
          if (r.ok) {
            const d = await r.json();
            const detail = d.data || d;
            if (detail?.downloadUrl) url = detail.downloadUrl;
          }
        } catch {
          /* keep the opds download fallback */
        }

        const { library, setLibrary } = useLibraryStore.getState();
        const safeName = book.title.replaceAll(/[/\\:*?"<>|]/g, '_').slice(0, 120) || book.id;
        let dstFilePath = await appService.resolveFilePath(`${safeName}.epub`, 'Cache');
        const responseHeaders = await downloadFile({
          appService,
          dst: dstFilePath,
          cfp: '',
          url,
          singleThreaded: true,
          skipSslVerification: true,
        });
        const probed = await probeFilename(responseHeaders);
        if (probed) {
          const renamed = await appService.resolveFilePath(probed, 'Cache');
          await appService.copyFile(dstFilePath, 'None', renamed, 'None');
          await appService.deleteFile(dstFilePath, 'None');
          dstFilePath = renamed;
        }
        const imported = await appService.importBook(dstFilePath, library);
        if (!imported) throw new Error('importBook returned null');
        setLibrary(library);
        await appService.saveLibraryBooks(library);
        navigateToReader(router, [imported.hash]);
      } catch (e) {
        console.error('[catalog] failed to open book', e);
        setErrorId(book.id);
      } finally {
        setOpeningId((id) => (id === book.id ? null : id));
      }
    },
    [appService, router, openingId],
  );

  return { open, openingId, errorId };
}
