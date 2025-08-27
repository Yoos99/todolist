"use client";
export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return <button className={`btn ${className}`} {...rest} />;
}
