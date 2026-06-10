'use client';

import { useLegalLang } from '../useLegalLang';

export default function AboutContent() {
  const { lang } = useLegalLang();

  if (lang === 'ru') {
    return (
      <article className='prose prose-gray max-w-none'>
        <h1>О сервисе Aziral Books</h1>

        <p>
          Aziral Books — это онлайн-читалка и курируемый каталог произведений общественного
          достояния. Он построен на основе проекта с открытым кодом{' '}
          <a href='https://github.com/readest/readest' rel='noopener'>
            Readest
          </a>
          . Наше дополнение — серверный OPDS-каталог, который агрегирует Project Gutenberg и Open
          Library, чтобы вам не приходилось искать по зеркалам чистую копию <em>«Войны и мира»</em>.
        </p>

        <h2>Что вы получаете</h2>
        <ul>
          <li>Удобную читалку EPUB и PDF с выделениями, закладками и заметками.</li>
          <li>Растущий каталог общественного достояния, с поиском и поддержкой OPDS.</li>
          <li>Синхронизацию между веб-, десктоп- и мобильными клиентами (на базе CRDT).</li>
          <li>Загрузку собственных легально приобретённых книг с синхронизацией.</li>
        </ul>

        <h2>Зачем это нужно</h2>
        <p>
          Каталоги общественного достояния огромны, но разрозненны. Большинство читалок либо
          запирают вас в проприетарном магазине, либо дают сырой OPDS-фид и оставляют наедине с ним.
          Мы хотели единое место, где каталог курируется, читалка приятная, а библиотека следует за
          вами между устройствами — без слежки, рекламы и тёмных паттернов.
        </p>

        <h2>Кто мы</h2>
        <p>
          Aziral — небольшая софтверная студия из Алматы, Казахстан. Мы также развиваем{' '}
          <a href='https://aziral.com'>aziral.com</a> (ИТ-услуги и обучение),{' '}
          <a href='https://crm.aziral.shop'>CRM</a> и другие продукты, которые можно найти на
          главном сайте.
        </p>

        <h2>Открытый код</h2>
        <p>
          Веб- и мобильные клиенты Aziral Books — форки Readest и остаются open-source. Исходники:{' '}
          <a href='https://github.com/AZIRALGROUP/aziral-books' rel='noopener'>
            github.com/AZIRALGROUP/aziral-books
          </a>
          . Бэкенд (OPDS-агрегатор + API) тоже открыт:{' '}
          <a href='https://github.com/AZIRALGROUP/aziral-books-backend' rel='noopener'>
            github.com/AZIRALGROUP/aziral-books-backend
          </a>
          .
        </p>

        <h2>Контакты</h2>
        <ul>
          <li>
            Общие вопросы: <a href='mailto:hello@aziral.com'>hello@aziral.com</a>
          </li>
          <li>
            Поддержка: <a href='mailto:support@aziral.com'>support@aziral.com</a>
          </li>
          <li>
            Продажи / партнёрства: <a href='mailto:sales@aziral.com'>sales@aziral.com</a>
          </li>
        </ul>
      </article>
    );
  }

  return (
    <article className='prose prose-gray max-w-none'>
      <h1>About Aziral Books</h1>

      <p>
        Aziral Books is an online ebook reader and a curated catalogue of public-domain works. It is
        built on top of the open-source{' '}
        <a href='https://github.com/readest/readest' rel='noopener'>
          Readest
        </a>{' '}
        project. Our addition is a server-side OPDS catalogue that aggregates Project Gutenberg and
        Open Library so you don&rsquo;t have to chase mirror sites for a clean copy of{' '}
        <em>War and Peace</em>.
      </p>

      <h2>What you get</h2>
      <ul>
        <li>A focused reader for EPUB and PDF with highlights, bookmarks, and notes.</li>
        <li>A growing public-domain catalogue, searchable and OPDS-compatible.</li>
        <li>Sync across web, desktop, and mobile clients (CRDT-based, conflict-tolerant).</li>
        <li>Upload your own legally-acquired ebooks; we&rsquo;ll keep them in sync.</li>
      </ul>

      <h2>Why it exists</h2>
      <p>
        Public-domain catalogues are vast but scattered. Most readers either lock you into a
        proprietary store or hand you a raw OPDS feed and walk away. We wanted a single place where
        the catalogue is curated, the reader is good, and your library follows you across devices —
        without surveillance, ads, or dark patterns.
      </p>

      <h2>Who we are</h2>
      <p>
        Aziral is a small software studio based in Almaty, Kazakhstan. We also run{' '}
        <a href='https://aziral.com'>aziral.com</a> (IT services and training),{' '}
        <a href='https://crm.aziral.shop'>CRM</a>, and a few other products you can find from the
        main site.
      </p>

      <h2>Open source</h2>
      <p>
        Aziral Books&rsquo; web and mobile clients are forks of Readest and remain open-source.
        Source:{' '}
        <a href='https://github.com/AZIRALGROUP/aziral-books' rel='noopener'>
          github.com/AZIRALGROUP/aziral-books
        </a>
        . The backend (OPDS aggregator + API) is open-source too:{' '}
        <a href='https://github.com/AZIRALGROUP/aziral-books-backend' rel='noopener'>
          github.com/AZIRALGROUP/aziral-books-backend
        </a>
        .
      </p>

      <h2>Contact</h2>
      <ul>
        <li>
          General: <a href='mailto:hello@aziral.com'>hello@aziral.com</a>
        </li>
        <li>
          Support: <a href='mailto:support@aziral.com'>support@aziral.com</a>
        </li>
        <li>
          Sales / partnerships: <a href='mailto:sales@aziral.com'>sales@aziral.com</a>
        </li>
      </ul>
    </article>
  );
}
