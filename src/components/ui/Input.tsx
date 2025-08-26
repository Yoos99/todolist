"use client";
export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      className={`rounded-pill w-full border-2 border-[var(--color-ink,#0F172A)] bg-[var(--color-slate-100,#F1F5F9)] px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--color-violet-600,#7C3AED)] ${className}`}
      {...rest}
    />
  );
}
