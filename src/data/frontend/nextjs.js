const nextjs = [
  {
    id: 1,
    question: "What is Server-Side Rendering (SSR)?",
    answer: "SSR is the process of rendering a web page on the server and sending the fully rendered HTML to the client. In Next.js, this is achieved using Server Components or 'getServerSideProps'."
  },
  {
    id: 2,
    question: "Explain the difference between the Next.js 'Image' component and the standard <img> tag.",
    answer: "The Next.js Image component provides automatic optimizations like lazy loading, resizing, and format conversion. A standard <img> tag requires manual implementation of these features.",
    code: "import Image from 'next/image'\n\n<Image src=\"/profile.png\" alt=\"User Profile\" width={500} height={500} />"
  }
];

export default nextjs;
