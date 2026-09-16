// 「その他の制作物」グリッドのカード1件分
export type Work = {
  slug: string;
  title: string;
  description: string;
  year: string;
  thumbnail: string;
  href: string;
};

// Nisoine（主要制作物）セクション
export type Featured = {
  label: string;
  heading: string;
  description: string;
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
  photo: string;
  screen: string;
  phoneFrame: string;
};

// HOW I WORK の1項目
export type HowIWorkItem = {
  title: string;
  body: string;
  label: string;
  marker: "circle" | "triangle" | "square" | "dot";
  markerColor: "coral" | "amber" | "green" | "sage";
};

// サイト共通のメタ情報（ヘッダー・フッター・SEO metadata で参照）
export type SiteMeta = {
  url: string;
  title: string;
  description: string;
  name: string;
  tagline: string;
  sub: string;
  nav: string[];
  email: string;
  social: { label: string; href: string }[];
  copyright: string;
};
