"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { uploadImage } from "@/lib/api";
import ImageButton from "@/components/ui/ImageButton";

type Props = {
  imageUrl?: string;
  onUploaded: (url: string) => void;
  onClear: () => void;
  heightClass?: string;
};

export default function ImageUploader({
  imageUrl,
  onUploaded,
  onClear,
  heightClass = "h-48", // 기본 높이
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const choose = () => inputRef.current?.click();

  const validate = (file: File): string | null => {
    if (!/^[A-Za-z0-9._-]+$/.test(file.name)) return "영문/숫자/._- 파일명만 허용돼요.";
    if (!file.type.startsWith("image/")) return "이미지 파일만 업로드할 수 있어요.";
    if (file.size > 5 * 1024 * 1024) return "5MB 이하 파일만 업로드할 수 있어요.";
    return null;
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const file = inputEl.files?.[0];
    if (!file) return;
    const err = validate(file);
    if (err) {
      alert(err);
      inputEl.value = "";
      return;
    }
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onUploaded(url);
    } catch (err: any) {
      console.error("upload error:", err?.response?.status, err?.response?.data);
      alert("업로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
      else inputEl.value = "";
    }
  };

  return (
    <div
      className={[
        "relative rounded-[12px] border-2 border-dashed border-[var(--color-ink,#0F172A)]",
        "overflow-hidden bg-[var(--color-slate-100,#F1F5F9)]",
        heightClass, // ⬅부모와 높이 동기화
      ].join(" ")}
    >
      {imageUrl ? (
        //업로드된 상태
        <div className="relative h-full w-full">
          <img src={imageUrl} alt="업로드된 이미지" className="h-full w-full object-cover" />
          <ImageButton
            preset="photo-edit"
            size={36}
            className="absolute bottom-2 right-2"
            onClick={choose}
            ariaLabel="사진 수정"
            disabled={busy}
          />
        </div>
      ) : (
        //빈 상태
        <button
          type="button"
          onClick={choose}
          disabled={busy}
          aria-label="사진 추가"
          title="사진 추가"
          className="relative block h-full w-full"
        >
          <Image
            src="/img/placeholder-photo.png"
            alt=""
            sizes="12px"
            fill
            className="pointer-events-none object-contain opacity-80"
            priority={false}
          />
          <span className="pointer-events-none absolute bottom-2 right-2">
            <ImageButton preset="photo-add" size={36} ariaLabel="" disabled />
          </span>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );
}
