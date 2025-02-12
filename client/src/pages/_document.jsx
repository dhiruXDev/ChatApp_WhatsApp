import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
            <Main />
            <NextScript />
            <div id="photo-picker-element"></div>  {/*  This means the cusom dic i.e, for uploading photo on Profile is added */}
      </body>
    </Html>
  );
}
