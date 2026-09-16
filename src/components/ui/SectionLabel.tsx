type SectionLabelProps = {
  label: string;
};

// 「— ラベル —」形式のセクション見出しラベル
export default function SectionLabel({ label }: SectionLabelProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
      <span className="text-label tracking-label text-gray">{label}</span>
      <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
    </div>
  );
}
