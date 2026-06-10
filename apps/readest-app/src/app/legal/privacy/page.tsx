import type { Metadata } from 'next';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'Aziral Books — Privacy Notice.',
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
