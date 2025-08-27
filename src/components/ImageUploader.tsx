"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
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
  heightClass = "h-48",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  // 업로드 직후 즉시 전환되도록 프리뷰 상태 사용
  const [previewUrl, setPreviewUrl] = useState(imageUrl ?? "");
  useEffect(() => setPreviewUrl(imageUrl ?? ""), [imageUrl]);

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

    const errMsg = validate(file);
    if (errMsg) {
      alert(errMsg);
      inputEl.value = "";
      return;
    }

    setBusy(true);
    try {
      const url = await uploadImage(file);
      setPreviewUrl(url);
      onUploaded(url);
    } catch (err: unknown) {
      console.error("upload error:", err);
      alert("업로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
      else inputEl.value = "";
    }
  };

  const handleClear = () => {
    setPreviewUrl("");
    onClear();
  };

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl",
        "bg-[var(--color-slate-100,#F1F5F9)]",
        heightClass,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl border-2 border-dashed border-[var(--color-slate-400,#94A3B8)]" />

      {previewUrl ? (
        <>
          <Image
            src={previewUrl}
            alt="업로드된 이미지"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="z-0 object-cover"
          />

          <button
            type="button"
            onClick={handleClear}
            disabled={busy}
            aria-label="이미지 삭제"
            className="absolute left-2 top-2 z-20 rounded-full bg-white/90 px-2 py-0.5 text-xs shadow ring-1 ring-[var(--color-ink,#0F172A)]"
          >
            삭제
          </button>

          <ImageButton
            preset="photo-edit"
            size={36}
            onClick={choose}
            ariaLabel="사진 수정"
            className="absolute bottom-2 right-2 z-20"
            disabled={busy}
          />
        </>
      ) : (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={choose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                choose();
              }
            }}
            className="relative grid h-full w-full place-items-center"
          >
            <Image
              src="/img/placeholder-photo.png"
              alt=""
              width={80}
              height={80}
              className="opacity-70"
              priority={false}
            />
          </div>

          <ImageButton
            preset="photo-add"
            size={36}
            onClick={choose}
            ariaLabel="사진 추가"
            className="absolute bottom-2 right-2 z-20"
            disabled={busy}
          />
        </>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );
}
