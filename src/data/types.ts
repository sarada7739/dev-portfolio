// 「その他の制作物」に表示するカード1件分のデータ
export type Work = {
  slug: string;
  title: string;
  titleMasked?: string;
  description: string;
  year: string;
  thumbnail: string;
  href: string;
  image?: string;
  github?: string;
};

// 主要な制作物として紹介する Nisoine のデータ
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

// 「開発について」に表示する1項目分のデータ
export type HowIWorkItem = {
  title: string;
  body: string;
  label: string;
  marker: "circle" | "triangle" | "square" | "dot";
  markerColor: "coral" | "amber" | "green" | "sage";
};

// ヘッダー、フッター、検索用メタデータで参照するサイト共通の情報
export type SiteMeta = {
  url: string;
  title: string;
  description: string;
  tagline: string;
  sub: string;
  author: string;
  nav: string[];
  email: string;
  social: { label: string; href: string }[];
  copyright: string;
};
