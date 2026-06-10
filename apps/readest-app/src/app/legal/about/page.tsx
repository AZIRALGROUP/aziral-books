import type { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Aziral Books.',
};

export default function AboutPage() {
  return <AboutContent />;
}
