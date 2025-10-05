// pages/_app.tsx

import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/app/globals.css"; // Global styles
import { Inter } from 'next/font/google';

// Optimized font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);