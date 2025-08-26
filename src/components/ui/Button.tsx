"use client";
export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      className={`rounded-pill border-2 border-[var(--color-ink,#0F172A)] px-4 py-2 hover:opacity-90 disabled:opacity-50 ${className}`}
      {...rest}
    />
  );
}
