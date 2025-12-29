import type { Metadata } from "next";
import {  Roboto } from "next/font/google";
import "./globals.css";

const RobotoMono = Roboto({
subsets: ["latin"],
weight: ["400", "700"],
variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
metadataBase: new URL("https://itruthnews.com"), // <-- set your production domain here
title: "iTruth News | Smart News for Honest Minds",
description: "Breaking political news, in-depth analysis, and fact-based reporting from iTruth News.",
openGraph: {
title: "iTruth News",
description: "Breaking political news and analysis.",
url: "https://itruthnews.com",
siteName: "iTruth News",

images: [
{
url: "/images/itruthnews.png", // resolves to https://itruthnews.com/og-image.png
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
description: "Breaking political news, in-depth analysis, and fact-based reporting from iTruth News.",
images: ["/images/itruthnews.png"], // resolves correctly now
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
className={`${RobotoMono.variable} antialiased`}>
{children}
</body>
</html>
);
}
