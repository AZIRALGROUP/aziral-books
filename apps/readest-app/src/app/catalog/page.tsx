import type { Metadata } from 'next';
import CatalogClient from './CatalogClient';

export const metadata: Metadata = {
  title: 'Каталог',
  description:
    'Каталог Aziral Books — книги общественного достояния из Project Gutenberg, Open Library и Internet Archive.',
};

// Public branded catalogue ("store") screen, backed by the Aziral search API.
// Distinct from /opds (the generic OPDS browser used for arbitrary catalogs).
export default function CatalogPage() {
  return <CatalogClient />;
}
