import { CONTACT_EMAIL, FB_EVENT_URL, getFaq, getScheduleData, getScheduleLabels } from "@/lib/content";
import { buildLlms } from "@/lib/llms";
import { SITE_URL } from "@/lib/seo";

// /llms.txt (https://llmstxt.org) - generowany w buildzie z danych harmonogramu.
export const dynamic = "force-static";

export async function GET() {
  const [data, labels, faq] = await Promise.all([
    getScheduleData(),
    getScheduleLabels("pl"),
    getFaq("pl"),
  ]);
  const body = buildLlms({
    siteUrl: SITE_URL,
    fbEventUrl: FB_EVENT_URL,
    email: CONTACT_EMAIL,
    data,
    labels,
    faq,
  });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
