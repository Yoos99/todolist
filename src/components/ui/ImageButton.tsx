"use client";

import Image from "next/image";
import React from "react";

type Preset =
  | "add"
  | "save"
  | "delete"
  | "photo-add"
  | "photo-edit"
  | "placeholder-photo"
  | "active";

const PRESET = {
  add: {
    kind: "pill" as const,
    src: "/img/buttons/btn-add-outline.png",
    width: 132,
    height: 44,
    a11y: "추가하기",
  },
  save: {
    kind: "pill" as const,
    src: "/img/buttons/btn-done-lime.png",
    width: 132,
    height: 44,
    a11y: "수정 완료",
  },
  delete: {
    kind: "pill" as const,
    src: "/img/buttons/btn-delete-rose.png",
    width: 120,
    height: 44,
    a11y: "삭제하기",
  },
  "photo-add": {
    kind: "icon" as const,
    src: "/img/buttons/ic-circle-plus-light.png",
    size: 48,
    a11y: "사진 추가",
  },
  "photo-edit": {
    kind: "icon" as const,
    src: "/img/buttons/ic-circle-pencil-dark.png",
    size: 40,
    a11y: "사진 수정",
  },
  "placeholder-photo": {
    kind: "icon" as const,
    src: "/img/placeholder-photo.png",
    size: 24,
    a11y: "사진 추가",
  },
  active: {
    kind: "pill" as const,
    src: "/img/buttons/active.png",
    width: 132,
    height: 44,
    a11y: "사진 추가",
  },
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  preset: Preset;
  ariaLabel?: string;
  className?: string;
  size?: number;
};

export default function ImageButton({ preset, ariaLabel, className = "", size, ...rest }: Props) {
  const cfg = PRESET[preset];
  const label = ariaLabel ?? cfg.a11y;
  const base =
    "relative inline-flex items-center justify-center select-none cursor-pointer disabled:cursor-not-allowed " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-violet-600,#7C3AED)] focus-visible:outline-offset-2";

  if (cfg.kind === "pill") {
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        className={`${base} ${className}`}
        style={{ width: cfg.width, height: cfg.height, borderRadius: 9999 }}
        {...rest}
      >
        <Image
          src={cfg.src}
          alt=""
          fill
          sizes={`${cfg.width}px`}
          className="pointer-events-none -z-10 object-fill"
        />
      </button>
    );
  }

  const s = size ?? cfg.size;
  return (
    <button
      type="button"
      title={label}
      className={`${base} ${className}`}
      style={{ width: s, height: s, borderRadius: 9999 }}
      {...rest}
    >
      <Image
        src={cfg.src}
        alt=""
        fill
        sizes={`${s}px`}
        className="pointer-events-none -z-10 object-fill"
      />
    </button>
  );
}
