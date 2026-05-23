import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Provider from "./provider";
import Footer from "./_components/Footer";

export const metadata = {
  title: "Interior AI",
  description: "AI Interior Design App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Provider>
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {children}
              </main>

              <Footer />
            </div>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}