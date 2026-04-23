const nextjs = {
  Basic: [
    {
      id: 1,
      question: "What is Server-Side Rendering (SSR)?",
      answer: "SSR is the process of rendering a web page on the server and sending the fully rendered HTML to the client. In Next.js, this is often done using 'getServerSideProps' or Server Components."
    }
  ],
  Medium: [
    {
      id: 2,
      question: "Explain the difference between 'Image' component and <img> tag in Next.js.",
      answer: "The Next.js Image component optimizes images automatically (lazy loading, resizing, format conversion), whereas a standard <img> tag does none of these by default.",
      code: "import Image from 'next/image'\n\n<Image src=\"/me.png\" alt=\"Me\" width={500} height={500} />"
    }
  ],
  Hard: []
};

export default nextjs;
