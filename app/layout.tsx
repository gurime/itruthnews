import type { Metadata } from "next";
import {  Montserrat } from "next/font/google";
import "./globals.css";


const geistMono = Montserrat({
variable: "--font-geist-mono",
subsets: ["latin"],
});


export const metadata: Metadata = {
metadataBase: new URL("https://itruthnews.com"), // <-- set your production domain here
title: "iTruth News",
description: "Breaking political news, in-depth analysis, and fact-based reporting from iTruth News.",
openGraph: {
title: "iTruth News",
description: "Breaking political news and analysis.",
url: "https://itruthnews.com",
siteName: "iTruth News",

images: [
{
url: "/og-image.png", // resolves to https://itruthnews.com/og-image.png
width: 1200,
height: 630,
alt: "iTruth News logo",
},
],

locale: "en_US",
type: "website",
},
twitter: {
card: "summary_large_image",
title: "iTruth News",
description: "Breaking political news and fact-based reporting.",
images: ["/og-image.png"], // resolves correctly now
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
<html lang="en">
<body
className={`${geistMono.variable} antialiased`}>
{children}
</body>
</html>
);
}
