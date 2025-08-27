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

    const err = validate(file);
    if (err) {
      alert(err);
      inputEl.value = "";
      return;
    }

    setBusy(true);
    try {
      const url = await uploadImage(file);
      setPreviewUrl(url);
      onUploaded(url); // 서버/캐시 업데이트는 비동기 진행
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
            // unoptimized
          />

          <button
            type="button"
            onClick={choose}
            disabled={busy}
            aria-label="사진 수정"
            className="absolute bottom-2 right-2 z-20"
          >
            <ImageButton preset="photo-edit" size={36} ariaLabel="사진 수정" />
          </button>
        </>
      ) : (
        <>
          <div className="z-0 flex h-full w-full items-center justify-center">
            <Image
              src="/img/placeholder-photo.png"
              alt=""
              width={80}
              height={80}
              className="opacity-70"
            />
          </div>

          <button
            type="button"
            onClick={choose}
            disabled={busy}
            aria-label="사진 추가"
            className="absolute bottom-2 right-2 z-20"
          >
            <ImageButton preset="photo-add" size={36} ariaLabel="사진 추가" />
          </button>
        </>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );
}
