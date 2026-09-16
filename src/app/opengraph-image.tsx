import { ImageResponse } from "next/og";
import { site } from "@/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#f2f0ea"; // docs/design-tokens.md cream
const INK = "#1a1d23"; // docs/design-tokens.md ink
const GRAY = "#8b8b88"; // docs/design-tokens.md gray

// satori は woff2 非対応のため、TTF を返す UA を偽装して Google Fonts CSS から実ファイルURLを引く
async function loadGoogleFont(text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(cssUrl, {
      headers: {
        // woff2/woff非対応を装うUAでないとGoogle FontsがTTFを返さない（satoriはwoff2/woff未対応）
        "User-Agent":
          "Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.0 Safari/534.34",
      },
    })
  ).text();

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (!resource) throw new Error("font_css_not_found");

  const fontResponse = await fetch(resource[1]);
  if (!fontResponse.ok) throw new Error("font_file_fetch_failed");
  return fontResponse.arrayBuffer();
}

export default async function Image() {
  const text = `${site.tagline}${site.sub}`;
  let fontData: ArrayBuffer | null = null;
  try {
    fontData = await loadGoogleFont(text);
  } catch (error) {
    // フォント取得失敗時もOGP画像の生成自体は止めない。理由の種別のみ出す
    console.error(
      "opengraph-image:font_fetch_failed",
      error instanceof Error ? error.message : "unknown",
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: CREAM,
          // satori はキー自体の有無で判定するため、フォールバック時はキーごと外す
          ...(fontData ? { fontFamily: "Shippori Mincho" } : {}),
        }}
      >
        <div
          style={{
            fontSize: 56, // docs/design-tokens.md display スケール（デスクトップ側）
            lineHeight: 1.3, // docs/design-tokens.md display 行間
            color: INK,
            textAlign: "center",
            whiteSpace: "pre-line",
          }}
        >
          {site.tagline}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 20,
            color: GRAY,
          }}
        >
          {site.sub}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Shippori Mincho", data: fontData, style: "normal", weight: 600 }]
        : undefined,
    },
  );
}
