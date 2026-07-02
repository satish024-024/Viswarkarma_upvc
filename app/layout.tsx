import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const BASE_URL = 'https://viswakarma-upvc.vercel.app';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Viswakarma uPVC & Aluminium | Windows & Doors | Rajahmundry, AP",
    template: "%s | Viswakarma uPVC & Aluminium",
  },
  description:
    "Premium uPVC & Aluminium windows, doors, mosquito mesh & glass railing solutions. Factory-direct from Rajahmundry, Andhra Pradesh. 25+ years of custom fabrication & precision installation across AP, Telangana & Pan-India.",
  keywords: [
    "uPVC windows Rajahmundry",
    "aluminium windows Rajahmundry",
    "uPVC doors Rajahmundry",
    "upvc windows andhra pradesh",
    "upvc windows vijayawada",
    "upvc windows visakhapatnam",
    "aluminium doors AP",
    "mosquito mesh Rajahmundry",
    "glass railing Rajahmundry",
    "sliding windows Rajahmundry",
    "casement windows AP",
    "upvc window manufacturers india",
    "Viswakarma uPVC",
    "window installation Rajahmundry",
    "glass elevation work Rajahmundry",
    "upvc windows price Rajahmundry",
    "aluminium windows price AP",
    "double glazed windows india",
    "soundproof windows Rajahmundry",
  ],
  authors: [{ name: "Viswakarma uPVC & Aluminium" }],
  creator: "Viswakarma uPVC & Aluminium",
  publisher: "Viswakarma uPVC & Aluminium",
  category: "Home Improvement",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Viswakarma uPVC & Aluminium",
    title: "Viswakarma uPVC & Aluminium | Premium Windows & Doors | Rajahmundry",
    description:
      "Factory-direct uPVC & Aluminium windows, doors, mosquito mesh & glass solutions from Rajahmundry, AP. Free site measurement. 25+ years experience.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Viswakarma uPVC & Aluminium Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viswakarma uPVC & Aluminium | Rajahmundry, AP",
    description:
      "Premium uPVC & Aluminium windows and doors. Factory-direct from Rajahmundry. Free home estimate.",
    images: ["/logo.png"],
    creator: "@viswakarmaupvc",
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  verification: {
    // Add your Google Search Console verification code here after setup
    // google: "your-verification-code",
  },
};

// JSON-LD Local Business Schema — tells Google your exact business details
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Viswakarma uPVC & Aluminium",
  "alternateName": "Viswakarma UPVC",
  "description":
    "Premium uPVC & Aluminium windows, doors, mosquito mesh and glass railing solutions. Factory-direct manufacturing and installation in Rajahmundry, Andhra Pradesh.",
  "url": BASE_URL,
  "logo": `${BASE_URL}/logo.png`,
  "image": `${BASE_URL}/logo.png`,
  "telephone": "+91-9505683584",
  "email": "contact@viswakarmaupvc.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bommuru",
    "addressLocality": "Rajahmundry",
    "addressRegion": "Andhra Pradesh",
    "postalCode": "533101",
    "addressCountry": "IN",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 17.0005,
    "longitude": 81.8040,
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
      ],
      "opens": "09:30",
      "closes": "19:00",
    },
  ],
  "areaServed": [
    { "@type": "City", "name": "Rajahmundry" },
    { "@type": "City", "name": "Vijayawada" },
    { "@type": "City", "name": "Visakhapatnam" },
    { "@type": "City", "name": "Kakinada" },
    { "@type": "City", "name": "Hyderabad" },
    { "@type": "State", "name": "Andhra Pradesh" },
    { "@type": "State", "name": "Telangana" },
    { "@type": "Country", "name": "India" },
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Window & Door Systems",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "uPVC Windows" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "uPVC Doors" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Aluminium Windows" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Aluminium Doors" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mosquito Mesh Screens" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Glass Railings & Balustrades" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Structural Glass Elevation" } },
    ],
  },
  "priceRange": "₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, Bank Transfer, UPI",
  "foundingDate": "2000",
  "numberOfEmployees": { "@type": "QuantitativeValue", "value": 10 },
  "sameAs": [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
