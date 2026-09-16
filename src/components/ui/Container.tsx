import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

// 全セクション共通の横幅制約。中央寄せと左右ガターをここに集約する
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto max-w-content px-gutter md:px-gutter-md ${className}`.trim()}>
      {children}
    </div>
  );
}
