type TagProps = {
  label: string;
};

// Nisoine セクションの技術タグ1件分のピル表示
export default function Tag({ label }: TagProps) {
  return (
    <span className="rounded-pill bg-coral-soft px-3 py-1 text-caption text-coral-text">
      {label}
    </span>
  );
}
