
@import "tailwindcss";

@theme {
  /* 1 Peeked Colors */
  --color-white: #ffffff;

  /* 33 Solid Colors */
  --color-gray: #888888;
  --color-gray-1: #8f8f8f;
  --color-pastel-orange: #ffaa47;
  --color-light-gray: #cbcbcb;
  --color-light-gray-1: #d0d0d0;
  --color-gainsboro: #e0e0e0;
  --color-gainsboro-1: #e4e4e4;
  --color-lavender: #e8e8e8;
  --color-white-smoke: #f1f1f1;
  --color-white-smoke-1: #f6f6f6;
  --color-white: #ffffff;
  --color-dim-gray: #666666;
  --color-blue-violet: #7c1bd6;
  --color-royal-blue: #3b82f6;
  --color-medium-orchid: #a855f7;
  --color-cornflower-blue: #6096ff;
  --color-black: #000000;
  --color-black-1: #101010;
  --color-black-2: #151515;
  --color-dark-gray: #181818;
  --color-black-3: #330000;
  --color-dark-gray-1: #1f1f1f;
  --color-dark-gray-2: #202020;
  --color-black-4: #440000;
  --color-dark-gray-3: #242424;
  --color-dark-gray-4: #252525;
  --color-dark-gray-5: #2a2a2a;
  --color-dark-red: #550000;
  --color-dark-gray-6: #333333;
  --color-dark-red-1: #660000;
  --color-dark-red-2: #770000;
  --color-charcoal: #454545;
  --color-dark-red-3: #880000;

}

/* Usage Examples */
/* Colors: bg-[colorName], text-[colorName], border-[colorName] */
/* Example: bg-color-white */
/* ... and 33 more colors */



@theme {
/* 26 Type Styles Identified, Selected: 20 */
  /* Typography – primitives (font families + sizes once) */
  --font-ui-sans-serif: ui-sans-serif, serif;
  --font-geist: Geist, sans-serif;
  --font-ui-monospace: ui-monospace, sans-serif;
  --text-11: 11px;
  --text-12: 12px;
  --text-14: 14px;
  --text-16: 16px;
  --text-17: 17px;
  --text-18: 18px;
  --text-20: 20px;
  --text-22: 22px;
  --text-100: 100px;
  --text-150: 150px;
  /* Semantic leading / tracking (one per type style) */
  --leading-large-title: 1.50;
  --leading-large-title-100: 1.50;
  --leading-h1: 1.36;
  --tracking-h1: -0.55px;
  --leading-h2: 1.40;
  --tracking-h2: -0.3px;
  --leading-large-body: 1.00;
  --leading-body: 1.00;
  --leading-h3: 1.72;
  --leading-body-16: 1.50;
  --leading-link: 1.85;
  --leading-button: 1.43;
  --leading-small-body: 1.85;
  --leading-link-14: 1.43;
  --leading-body-14: 1.43;
  --leading-caption: 1.25;
  --leading-caption-12: 1.62;
  --leading-link-12: 1.33;
  --leading-caption-12-400: 1.62;
  --leading-caption-12-400: 1.33;
  --leading-caption-12-300: 1.33;
  --leading-small: 1.36;
}

@layer components {
  .type-large-title {
    font-family: var(--font-ui-sans-serif);
    font-size: var(--text-150);
    font-weight: 400;
    line-height: var(--leading-large-title);
  }

  .type-large-title-100 {
    font-family: var(--font-ui-sans-serif);
    font-size: var(--text-100);
    font-weight: 400;
    line-height: var(--leading-large-title-100);
  }

  .type-h1 {
    font-family: var(--font-geist);
    font-size: var(--text-22);
    font-weight: 700;
    line-height: var(--leading-h1);
    letter-spacing: var(--tracking-h1);
  }

  .type-h2 {
    font-family: var(--font-geist);
    font-size: var(--text-20);
    font-weight: 700;
    line-height: var(--leading-h2);
    letter-spacing: var(--tracking-h2);
  }

  .type-large-body {
    font-family: var(--font-geist);
    font-size: var(--text-18);
    font-weight: 500;
    line-height: var(--leading-large-body);
  }

  .type-body {
    font-family: var(--font-geist);
    font-size: var(--text-18);
    font-weight: 400;
    line-height: var(--leading-body);
  }

  .type-h3 {
    font-family: var(--font-geist);
    font-size: var(--text-17);
    font-weight: 600;
    line-height: var(--leading-h3);
  }

  .type-body-16 {
    font-family: var(--font-geist);
    font-size: var(--text-16);
    font-weight: 400;
    line-height: var(--leading-body-16);
  }

  .type-link {
    font-family: var(--font-geist);
    font-size: var(--text-14);
    font-weight: 500;
    line-height: var(--leading-link);
  }

  .type-button {
    font-family: var(--font-geist);
    font-size: var(--text-14);
    font-weight: 500;
    line-height: var(--leading-button);
  }

  .type-small-body {
    font-family: var(--font-geist);
    font-size: var(--text-14);
    font-weight: 400;
    line-height: var(--leading-small-body);
  }

  .type-link-14 {
    font-family: var(--font-geist);
    font-size: var(--text-14);
    font-weight: 400;
    line-height: var(--leading-link-14);
  }

  .type-body-14 {
    font-family: var(--font-geist);
    font-size: var(--text-14);
    font-weight: 300;
    line-height: var(--leading-body-14);
  }

  .type-caption {
    font-family: var(--font-ui-monospace);
    font-size: var(--text-12);
    font-weight: 600;
    line-height: var(--leading-caption);
  }

  .type-caption-12 {
    font-family: var(--font-geist);
    font-size: var(--text-12);
    font-weight: 600;
    line-height: var(--leading-caption-12);
  }

  .type-link-12 {
    font-family: var(--font-ui-monospace);
    font-size: var(--text-12);
    font-weight: 500;
    line-height: var(--leading-link-12);
  }

  .type-caption-12-400 {
    font-family: var(--font-geist);
    font-size: var(--text-12);
    font-weight: 400;
    line-height: var(--leading-caption-12-400);
  }

  .type-caption-12-400 {
    font-family: var(--font-geist);
    font-size: var(--text-12);
    font-weight: 400;
    line-height: var(--leading-caption-12-400);
  }

  .type-caption-12-300 {
    font-family: var(--font-geist);
    font-size: var(--text-12);
    font-weight: 300;
    line-height: var(--leading-caption-12-300);
  }

  .type-small {
    font-family: var(--font-ui-monospace);
    font-size: var(--text-11);
    font-weight: 600;
    line-height: var(--leading-small);
  }

}

/* Usage Examples */
/* Typography: font-[familyName], text-[size], leading-[height] */
/* Example: font-ui-sans-serif */
/* Example: text-150 */