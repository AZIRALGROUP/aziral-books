'use client';

import { useLegalLang } from '../useLegalLang';

const UPDATED = '2026-06-08';

export default function TermsContent() {
  const { lang } = useLegalLang();

  if (lang === 'ru') {
    return (
      <article className='prose prose-gray max-w-none'>
        <h1>Условия использования</h1>
        <p className='text-sm text-gray-500'>Последнее обновление: {UPDATED}</p>

        <p>
          Добро пожаловать в Aziral Books (&laquo;<strong>Aziral Books</strong>&raquo;, &laquo;
          <strong>мы</strong>&raquo;, &laquo;<strong>нас</strong>&raquo;) — онлайн-читалку и
          OPDS-каталог, которым управляет компания Aziral (Алматы, Казахстан). Используя сервис по
          адресу <a href='https://books.aziral.com'>books.aziral.com</a> (&laquo;
          <strong>Сервис</strong>&raquo;), вы соглашаетесь с настоящими Условиями. Если вы не
          согласны — не используйте Сервис.
        </p>

        <h2>1. Сервис</h2>
        <p>
          Aziral Books позволяет просматривать каталог произведений общественного достояния (из
          Project Gutenberg, Open Library и аналогичных публичных баз), читать их в веб-читалке,
          загружать собственные легально приобретённые книги и синхронизировать библиотеку и
          прогресс чтения между устройствами. Aziral Books — форк проекта с открытым кодом Readest и
          находится в активной разработке.
        </p>

        <h2>2. Кто может пользоваться</h2>
        <p>
          Вам должно быть не менее 16 лет (или больше, если этого требует законодательство вашей
          страны). Несовершеннолетние используют Сервис с согласия родителя или законного
          представителя.
        </p>

        <h2>3. Аккаунты</h2>
        <ul>
          <li>Вы отвечаете за сохранность пароля и безопасность своего аккаунта.</li>
          <li>Один человек — один аккаунт. Не передавайте учётные данные.</li>
          <li>
            Вы можете удалить аккаунт в любой момент в{' '}
            <a href='/user/account'>настройках аккаунта</a>. Удаление стирает ваши персональные
            данные и загруженный контент из активных систем в течение 30 дней; о резервных копиях
            см. <a href='/legal/privacy'>Политику конфиденциальности</a>.
          </li>
        </ul>

        <h2>4. Допустимое использование</h2>
        <p>Вы обязуетесь НЕ:</p>
        <ul>
          <li>загружать контент, защищённый авторским правом, без права на его распространение;</li>
          <li>использовать Сервис для домогательств, спама, мошенничества или причинения вреда;</li>
          <li>
            проводить реверс-инжиниринг, массовый парсинг или попытки обойти ограничения, RLS и меры
            безопасности;
          </li>
          <li>
            перепродавать, ребрендировать или распространять Сервис без отдельного письменного
            соглашения.
          </li>
        </ul>
        <p>
          Мы можем приостановить или прекратить доступ к аккаунту, нарушающему эти правила, без
          предупреждения, если это необходимо для защиты Сервиса или других пользователей.
        </p>

        <h2>5. Ваш контент</h2>
        <p>
          Вы сохраняете право собственности на книги, заметки, выделения и иной загруженный контент
          (&laquo;<strong>Ваш контент</strong>&raquo;). Вы предоставляете нам ограниченную лицензию
          на хостинг, передачу и резервное копирование Вашего контента исключительно для работы
          Сервиса. Мы не продаём Ваш контент и не обучаем на нём ML-модели.
        </p>

        <h2>6. Каталог общественного достояния</h2>
        <p>
          Каталог, который мы индексируем из Project Gutenberg, Open Library и подобных источников,
          содержит произведения, считающиеся общественным достоянием в юрисдикции их происхождения.
          Авторский статус может различаться по странам — если в вашей стране произведение всё ещё
          под охраной, соблюдайте местное законодательство.
        </p>

        <h2>7. Платные функции</h2>
        <p>
          Некоторые функции могут требовать платной подписки. Цены, период оплаты, политика возврата
          и условия отмены показываются при оформлении. Подписки автопродлеваются до отмены. Вы
          можете отменить подписку в любой момент; доступ сохраняется до конца оплаченного периода.
        </p>

        <h2>8. Отказ от гарантий</h2>
        <p>
          Сервис предоставляется &laquo;как есть&raquo; и &laquo;как доступно&raquo;, без каких-либо
          гарантий, явных или подразумеваемых. Мы не гарантируем бесперебойную работу, отсутствие
          ошибок или доступность конкретной книги либо функции.
        </p>

        <h2>9. Ограничение ответственности</h2>
        <p>
          В максимально допустимой законом степени Aziral и её аффилированные лица не несут
          ответственности за любые косвенные, случайные, специальные или штрафные убытки, а также за
          упущенную прибыль, потерю данных или возможности использования, связанные с вашим
          использованием Сервиса.
        </p>

        <h2>10. Изменения</h2>
        <p>
          Мы можем обновлять настоящие Условия. О существенных изменениях мы сообщим на этой
          странице и, по возможности, по электронной почте. Продолжение использования Сервиса
          означает согласие с обновлёнными Условиями.
        </p>

        <h2>11. Применимое право</h2>
        <p>
          Настоящие Условия регулируются законодательством Республики Казахстан. Споры
          рассматриваются в судах города Алматы.
        </p>

        <h2>12. Контакты</h2>
        <p>
          Вопросы? Пишите на <a href='mailto:hello@aziral.com'>hello@aziral.com</a> или по адресу
          Aziral, Алматы, Казахстан.
        </p>
      </article>
    );
  }

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
