import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: 'Aziral Books — Privacy Notice.',
};

const UPDATED = '2026-06-08';

export default function PrivacyPage() {
  return (
    <article className='prose prose-gray max-w-none'>
      <h1>Privacy Notice</h1>
      <p className='text-sm text-gray-500'>Last updated: {UPDATED}</p>

      <p>
        Aziral Books is an online ebook reader and OPDS catalogue operated by Aziral, Almaty,
        Kazakhstan. This Notice describes what we collect, why, where it lives, and the controls you
        have. We try to keep it honest and short.
      </p>

      <h2>1. Data we collect</h2>
      <h3>1.1 Account</h3>
      <ul>
        <li>Email address (required to log in and recover access).</li>
        <li>
          A hashed password (we never see your plaintext password — it&rsquo;s salted and hashed by
          Supabase Auth).
        </li>
        <li>
          Optional profile fields you choose to add (display name, avatar). You can leave them
          blank.
        </li>
      </ul>

      <h3>1.2 Your library</h3>
      <ul>
        <li>
          Books you upload, plus their metadata (title, author, format, file hash, cover image when
          available).
        </li>
        <li>Reading progress, highlights, bookmarks, notes, and tags.</li>
        <li>Your custom dictionaries, fonts, themes, and OPDS catalogue subscriptions.</li>
      </ul>

      <h3>1.3 Catalogue interactions</h3>
      <ul>
        <li>Search queries you run against the Aziral Books public catalogue.</li>
        <li>Books you view or download from the catalogue.</li>
      </ul>

      <h3>1.4 Technical data</h3>
      <ul>
        <li>IP address, user agent, and timestamps on requests (kept in operational logs).</li>
        <li>
          Crash and error reports (no book content is included in error reports — only stack traces
          and runtime version info).
        </li>
      </ul>

      <p>
        We do <strong>not</strong> sell your data and we do <strong>not</strong> train machine
        learning models on Your Content.
      </p>

      <h2>2. Why we use it</h2>
      <ul>
        <li>
          <strong>Operate the Service:</strong> log you in, store and sync your library, serve the
          catalogue.
        </li>
        <li>
          <strong>Improve the Service:</strong> aggregate, non-personal usage statistics to find
          bugs and prioritise features.
        </li>
        <li>
          <strong>Security:</strong> detect abuse, brute-force, and fraud.
        </li>
        <li>
          <strong>Communicate with you:</strong> transactional emails (password resets, billing
          receipts, security notices).
        </li>
      </ul>

      <h2>3. Legal basis</h2>
      <p>
        We process personal data on the legal bases of (a) performance of our contract with you
        (these Terms), (b) our legitimate interest in operating and securing the Service, and (c)
        your consent where applicable (e.g. optional analytics).
      </p>

      <h2>4. Where it lives</h2>
      <ul>
        <li>
          <strong>Authentication and synced library data:</strong> Supabase (PostgreSQL), region
          us-east-1 (North Virginia, USA).
        </li>
        <li>
          <strong>OPDS catalogue and search index:</strong> our backend at books.aziral.com, hosted
          on Hetzner Cloud in Germany.
        </li>
        <li>
          <strong>Uploaded ebook files:</strong> object storage (Cloudflare R2 / S3). Currently
          configured per deployment — check <a href='/legal/about'>About</a> for the active
          provider.
        </li>
        <li>
          <strong>Operational logs:</strong> retained 30 days unless required longer for security
          investigation.
        </li>
      </ul>

      <h2>5. Third-party processors</h2>
      <ul>
        <li>
          <a href='https://supabase.com/privacy' rel='noopener'>
            Supabase
          </a>{' '}
          — auth + database.
        </li>
        <li>
          <a href='https://www.hetzner.com/legal/privacy-policy' rel='noopener'>
            Hetzner Online GmbH
          </a>{' '}
          — server hosting.
        </li>
        <li>
          <a href='https://www.cloudflare.com/privacypolicy/' rel='noopener'>
            Cloudflare
          </a>{' '}
          — CDN and (where enabled) object storage.
        </li>
        <li>
          <a href='https://stripe.com/privacy' rel='noopener'>
            Stripe
          </a>{' '}
          — payment processing (we never see your card number).
        </li>
      </ul>

      <h2>6. Your rights</h2>
      <p>You can:</p>
      <ul>
        <li>Access, export, or delete your account from your account settings.</li>
        <li>Correct any inaccurate personal data.</li>
        <li>Withdraw consent for optional processing (e.g. analytics) at any time.</li>
        <li>
          Lodge a complaint with the data protection authority of your country, including the
          Kazakhstan Personal Data Protection Authority.
        </li>
      </ul>
      <p>
        To exercise any of these, email <a href='mailto:hello@aziral.com'>hello@aziral.com</a>. We
        respond within 30 days.
      </p>

      <h2>7. Retention</h2>
      <ul>
        <li>Active account data: as long as your account exists.</li>
        <li>Deleted-account data: erased from production within 30 days.</li>
        <li>Encrypted off-site backups: rotated out within 90 days.</li>
        <li>Billing records: kept for the statutory retention period of Kazakhstan tax law.</li>
      </ul>

      <h2>8. Cookies and similar</h2>
      <p>
        We use a minimal set of first-party cookies needed to keep you logged in and to remember UI
        preferences. We do not use third-party advertising cookies. If we add optional analytics
        cookies in the future, we will ask for consent first.
      </p>

      <h2>9. Children</h2>
      <p>
        Aziral Books is not directed at children under 16. We do not knowingly collect personal data
        from anyone under that age. If you believe we have, please contact us so we can delete it.
      </p>

      <h2>10. Changes</h2>
      <p>
        Material changes will be highlighted on this page with an updated date and, where the change
        affects you, communicated by email. Continued use after the change means you accept the
        updated Notice.
      </p>

      <h2>11. Contact</h2>
      <p>
        Aziral, Almaty, Kazakhstan · <a href='mailto:hello@aziral.com'>hello@aziral.com</a>
      </p>
    </article>
  );
}
