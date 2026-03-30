import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { ClerkProvider } from "@clerk/nextjs";
import AppWrapper from "./providers/AppWrapper";
import "react-toastify/dist/ReactToastify.css";

config.autoAddCss = false;

export const metadata = {
  title: "Dissertation Hub",
  description: "Search and download dissertations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}