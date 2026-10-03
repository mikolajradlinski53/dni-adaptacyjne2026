import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { PODSTRONY_WYDARZENIA, WYDARZENIE_ZAKONCZONE } from "./src/lib/zakonczenie";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Po wydarzeniu podstrony prowadzą na podsumowanie (307 - da się wycofać).
  // Języki jak w src/i18n/routing.ts.
  async redirects() {
    if (!WYDARZENIE_ZAKONCZONE) return [];
    return [
      {
        source: `/:locale(pl|en|uk)/:path(${PODSTRONY_WYDARZENIA.join("|")})`,
        destination: "/:locale",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
