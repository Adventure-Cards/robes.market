import 'tailwindcss/tailwind.css'
import Head from 'next/head'
function Decks({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <style jsx global>
        {`
          body {
            background: #000000e0;
            color: white;
            overflow-x: hidden;
          }
        `}
      </style>
      <Head>
        <title>Decks.market</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@cmgs_" />
        <meta property="og:url" content="https://Decks.market" />
        <meta property="og:title" content="Decks.market" />
        <meta
          property="og:description"
          content="See the floor price of Adventure Decks."
        />
      </Head>
    </>
  )
}

export default Decks
