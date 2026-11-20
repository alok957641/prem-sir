import "./globals.css";

export const metadata = {
  title: "Prem & Nisha · Wedding Invitation",
  description:
    "With the blessings of Lord Ganesha and our elders, celebrate the wedding of Prem Ranjan and Nisha Kumari.",
  applicationName: "Prem & Nisha Wedding Invitation",
};

export const viewport = { themeColor: "#f8f3e9" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
