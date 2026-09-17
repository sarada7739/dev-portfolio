# design-tokens.md — 参照画像からの抽出

出典: `docs/reference/lp-reference.jpg`（768×1360）。色は領域平均・最彩度画素を PIL で計測した上で目視補正した推定値。
寸法は 768px 幅の画像を 1440px デスクトップ想定（×1.875）に換算している。唯一の出典はこの文書、転記先は `src/app/globals.css` の `@theme`。

## 配色
| トークン | hex | 用途 |
|---|---|---|
| cream | #f2f0ea | ヒーロー・制作物セクション・ナビの背景 |
| cream-deep | #eae9e3 | フッター背景 |
| blush | #fcf1eb | Nisoine セクション背景 |
| blush-edge | #dfd1c8 | Nisoine セクション下端の罫線 |
| navy | #0b1330 | HOW I WORK 背景の基準色（上 #0f1839 → 下 #06102b の縦グラデ） |
| navy-light / navy-deep | #0f1839 / #06102b | 同グラデの両端 |
| navy-card | #1b2441 | HOW I WORK のカード面（白 6% 相当の重ね） |
| navy-border | #39405b | HOW I WORK カードの枠線 |
| ink | #1a1d23 | 見出し・本文の墨色 |
| ink-soft | #363637 | カード見出し・フッター見出し |
| button | #10141e | 黒ボタン背景 |
| gray | #8b8b88 | サブコピー・カード説明・ナビ文字 |
| gray-light | #9e9d99 | 年号・フッターリンク |
| gray-faint | #b2b2ae | コピーライト |
| coral | #e8908b | アクセント。NISOINE ラベル・ロゴのハート・HOW I WORK のドット |
| coral-text | #d9807b | タグ文字 |
| coral-soft | #f9e0da | タグ背景 |
| coral-line | #e9aba7 | HOW I WORK 下端の珊瑚色の区切り線 |
| marker-amber | #e8b96a | HOW I WORK Agents マーカー（triangle） |
| marker-green | #7fc79f | HOW I WORK Trends マーカー（square） |
| marker-sage | #a9c5ac | HOW I WORK Craft マーカー（dot） |
| card | #f6f5f0 | 制作物カードの面（背景より一段明るい） |
| line | #e3e2dc | カード枠線・薄い罫線 |
| line-strong | #cfcdc6 | セクションラベル両脇のダッシュ |
| on-navy / on-navy-muted | #f2f0ea / #a9b0c4 | 紺地上の文字・右端ラベル |

## タイポグラフィ
- 見出し（serif）: **Shippori Mincho** 500/600。参照の見出しは細めの線で懐が広く、Noto Serif JP より軽やか・Zen Old Mincho より現代的な印象がこれに最も近い
- 本文（sans）: **Noto Sans JP** 400/500/700。字幅の広い標準的な日本語サンセリフで、参照のタグ・説明文に合う
- 欧文イタリック（display）: **Cormorant Garamond** 500/600 italic。HOW I WORK の「AI」など、高コントラストの欧文セリフに使う

| スケール | サイズ（clamp: モバイル → デスクトップ） | 行間 | 字間 |
|---|---|---|---|
| display | 34px → 62px | 1.2 | 0.02em |
| h1 | 28px → 50px | 1.35 | 0.02em |
| h2 | 31px | 1.4 | 0.02em |
| h3 | 20px | 1.5 | 0.02em |
| body | 16px | 1.8 | 0.02em |
| lead | 18px（サブコピー・フッターのメール。色は ink-soft） | 1.7 | 0.02em |
| small | 14px | 1.7 | 0.02em |
| caption | 12px | 1.5 | 0.1em |
| label | 16px（セクションラベル・NISOINE・ナビ。英字は大文字） | 1 | 0.25em |

字間トークン: heading 0.02em / wide 0.1em（年号・SNS）/ label 0.25em / nav 0.18em（ヘッダーナビ、色 ink-soft）。

## 余白・レイアウト
- 余白スケール: 4px 基準。Tailwind の `--spacing: 0.25rem` の倍数クラス（`pt-11.75` 等の小数倍も可）をそのまま使う
- セクション上下余白: デスクトップ 48px（section）/ モバイル 40px（section-sm）。各セクション固有の余白は個別に px 換算した倍数クラスで指定する（例: ヒーロー pt-10 pb-9.25）
- コンテナ最大幅: 1270px（container-content）。左右余白: モバイル 24px / md 48px / lg 以上 88px（gutter-lg）
- ナビ高さ: 64px。セクションラベルと見出しの間: 24px。見出しとサブコピーの間: 16px。ボタンまで: 32px
- 制作物グリッド: 4列（lg 1024px 以上）→ 2列（sm 640px 以上）→ 1列。カード間隔 20px。サムネイル比率 5:3
- HOW I WORK のカード: 縦積み、間隔 16px、内側余白 40px/20px、左のマーカー 20px（size-5）、右端ラベルは caption
- 写真比率 3:2（Nisoine の写真）。スマホ枠は写真の右に隣接配置、幅は写真の 1/3・比率 5:9（aspect-phone）、上下中央（lg 以上のみ。lg 未満は写真の下に中央）
- 写真の左右フェード（`fade-x` ユーティリティ）: 左 30% / 右 12% を透明→black、内側 58% は不透明。文字と重なる左側を広く溶かす

## 角丸・影・罫線
- 角丸: card 8px（制作物カード・サムネイル）/ panel 10px（HOW I WORK カード）/ pill 9999px（ボタン・タグ）/ phone 40px（Nisoine のスマホ枠）
- 影: card `0 1px 2px rgb(26 29 35 / 0.04), 0 4px 16px rgb(26 29 35 / 0.04)`。紺地では影なし
- 罫線: 基本 1px。色は line / navy-border / blush-edge / coral-line。HOW I WORK 上下の珊瑚線のみ 3px（`border-width-accent` → `border-y-accent` ユーティリティ）
- 背景画像: `--background-image-stars` — HOW I WORK の星空。on-navy を 60〜90% に薄めた 2〜3px の radial-gradient を左右の帯に計 22 個配置
- `aspect-phone` / `phone`（角丸）: T-018 で実機モックアップ画像に差し替えたため未使用。トークン自体は削除しない

## ブレークポイント
sm 640 / md 768 / lg 1024 / xl 1280（architecture.md の想定どおり。変更なし）

## 確度が低い項目
- navy-card / navy-border は星空の重ねで計測がぶれる。実装時は白の 6% / 14% 重ねで再現し、目視で合わせる
- coral 系はアンチエイリアスで薄まるため ±10 程度の誤差あり。coral を基準に他は派生とみなしてよい
