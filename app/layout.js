import "./globals.css";

export const metadata = {
  title: "AI Chatbot",
  description: "AI Chatbot Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<body className="w-full min-h-screen bg-[#F8F8FF] overflow-hidden">
          {children}
      </body>
    </html>
  );
}