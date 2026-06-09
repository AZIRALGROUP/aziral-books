import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Aziral Books — Terms of Service.',
};

const UPDATED = '2026-06-08';

export default function TermsPage() {
  return (
    <article className='prose prose-gray max-w-none'>
      <h1>Terms of Service</h1>
      <p className='text-sm text-gray-500'>Last updated: {UPDATED}</p>

      <p>
        Welcome to Aziral Books (&ldquo;<strong>Aziral Books</strong>&rdquo;, &ldquo;
        <strong>we</strong>&rdquo;, &ldquo;<strong>our</strong>&rdquo;, &ldquo;
        <strong>us</strong>&rdquo;), an online ebook reader and OPDS catalogue operated by Aziral,
        based in Almaty, Kazakhstan. By accessing or using the service available at{' '}
        <a href='https://books.aziral.com'>books.aziral.com</a> (the &ldquo;<strong>Service</strong>
        &rdquo;), you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        Aziral Books lets you browse a curated catalogue of public-domain works (sourced from
        Project Gutenberg, Open Library, and similar public databases), read them in a web reader,
        upload your own legally-acquired ebooks, and sync your library and reading progress across
        devices. Aziral Books is a fork of the open-source Readest project and remains a work in
        progress.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 16 years old (or the minimum age in your jurisdiction, whichever is
        higher) to create an account. If you are a minor, your parent or legal guardian must agree
        to these Terms on your behalf.
      </p>

      <h2>3. Accounts</h2>
      <ul>
        <li>You are responsible for keeping your password and account secure.</li>
        <li>One person, one account. Do not share credentials.</li>
        <li>
          You can delete your account at any time from{' '}
          <a href='/user/account'>your account settings</a>. Deletion removes your personal data and
          uploaded content from our active systems within 30 days; see the{' '}
          <a href='/legal/privacy'>Privacy Notice</a> for backup retention.
        </li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree NOT to:</p>
      <ul>
        <li>Upload copyrighted content you do not have the right to distribute.</li>
        <li>Use the Service to harass, spam, defraud, or harm others.</li>
        <li>
          Reverse-engineer, scrape at scale, or attempt to bypass rate-limits, RLS, or security
          controls.
        </li>
        <li>Resell, rebrand, or redistribute the Service without a separate written agreement.</li>
      </ul>
      <p>
        We may suspend or terminate accounts that violate these rules without notice if necessary to
        protect the Service or other users.
      </p>

      <h2>5. Your content</h2>
      <p>
        You retain ownership of ebooks, notes, highlights, and other content you upload (&ldquo;
        <strong>Your Content</strong>&rdquo;). You grant us a limited licence to host, transmit, and
        back up Your Content solely to operate the Service for you. We do not sell Your Content and
        we do not train ML models on it.
      </p>

      <h2>6. Public-domain catalogue</h2>
      <p>
        The catalogue we index from Project Gutenberg, Open Library, and similar sources contains
        works believed to be in the public domain in their jurisdiction of origin. Copyright status
        can vary by country — if you access the catalogue from a country where a particular work is
        still under copyright, please respect local law.
      </p>

      <h2>7. Paid features</h2>
      <p>
        Some features may require a paid subscription. Pricing, billing intervals, refund policy,
        and cancellation are presented at checkout. Subscriptions auto-renew until cancelled. You
        can cancel any time; access continues until the end of the paid period.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
        warranties of any kind, express or implied. We do not warrant that the Service will be
        uninterrupted, error-free, or that any specific book or feature will be available.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, Aziral and its affiliates will not be
        liable for any indirect, incidental, special, consequential, or punitive damages, or for
        loss of profits, revenue, data, or use, arising out of or related to your use of the
        Service.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these Terms. If we make material changes we will post a notice on this page
        and, where reasonable, notify you by email. Continued use of the Service after the change
        means you accept the updated Terms.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of the Republic of Kazakhstan, without regard to its
        conflict-of-laws principles. Disputes will be heard in the courts of Almaty.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions? Email <a href='mailto:hello@aziral.com'>hello@aziral.com</a> or write to Aziral,
        Almaty, Kazakhstan.
      </p>
    </article>
  );
}
