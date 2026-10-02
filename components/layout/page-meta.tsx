import Head from "next/head";

const SITE_NAME = "Pokéstop Arcade";

interface Props {
  /** Page title. The site name is appended unless this is the home page. */
  title: string;
  description: string;
  /** Set on the home page so the title isn't "Pokéstop Arcade | Pokéstop Arcade". */
  isHome?: boolean;
}

/** Per-page title and Open Graph tags. Shared defaults live in _document.tsx. */
function PageMeta({ title, description, isHome = false }: Props) {
  const fullTitle = isHome || title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/pokeball.png" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/pokeball.png" />
    </Head>
  );
}

export default PageMeta;
