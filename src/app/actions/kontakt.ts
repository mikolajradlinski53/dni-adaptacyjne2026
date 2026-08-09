"use server";

// POST z serwera Next do Apps Script (backend na koncie administracja@).
// URL i sekret trzymane po stronie serwera (env). Zwraca klucz statusu -
// tłumaczenie robi komponent przez next-intl.

type Formularz = "wspolpraca" | "ogolny";

export type StanFormularza = {
  status: "idle" | "ok" | "blad_walidacji" | "blad_serwera";
};

export async function wyslijZgloszenie(
  formularz: Formularz,
  _prev: StanFormularza,
  formData: FormData
): Promise<StanFormularza> {
  const hp = (formData.get("firma") ?? "").toString(); // honeypot
  const email = (formData.get("email") ?? "").toString().trim();
  const tresc = (formData.get("tresc") ?? "").toString().trim();

  if (hp) return { status: "ok" }; // bot → udaj sukces
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || tresc.length < 3) {
    return { status: "blad_walidacji" };
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) return { status: "blad_serwera" };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formularz,
        imie: (formData.get("imie") ?? "").toString().trim(),
        email,
        tresc,
        hp,
        secret: process.env.APPS_SCRIPT_SECRET,
      }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    return data?.ok ? { status: "ok" } : { status: "blad_serwera" };
  } catch {
    return { status: "blad_serwera" };
  }
}
