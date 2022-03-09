import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="h-full">
      <Head />
      <body className="h-full dark:bg-gray-6 dark:text-[#e7eaed] selection:bg-black selection:text-white dark:selection:bg-gray-3">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
