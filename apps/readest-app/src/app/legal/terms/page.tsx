import type { Metadata } from 'next';
import TermsContent from './TermsContent';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Aziral Books — Terms of Service.',
};

export default function TermsPage() {
  return <TermsContent />;
}
