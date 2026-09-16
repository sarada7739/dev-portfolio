type SectionLabelTone = "default" | "onNavy";

type SectionLabelProps = {
  label: string;
  tone?: SectionLabelTone;
};

const LINE_COLOR: Record<SectionLabelTone, string> = {
  default: "bg-line-strong",
  onNavy: "bg-navy-border",
};

const TEXT_COLOR: Record<SectionLabelTone, string> = {
  default: "text-gray",
  onNavy: "text-on-navy-muted",
};

// 「— ラベル —」形式のセクション見出しラベル。tone="onNavy" で紺地用の配色にする
export default function SectionLabel({ label, tone = "default" }: SectionLabelProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span aria-hidden="true" className={`h-px w-6 ${LINE_COLOR[tone]}`} />
      <span className={`text-label tracking-label ${TEXT_COLOR[tone]}`}>{label}</span>
      <span aria-hidden="true" className={`h-px w-6 ${LINE_COLOR[tone]}`} />
    </div>
  );
}
