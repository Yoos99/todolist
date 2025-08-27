"use client";

import { useEffect, useState } from "react";
import { useItem, useUpdateItem, useDeleteItem } from "@/lib/queries";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import ImageButton from "./ui/ImageButton";
import Header from "@/components/Header";
import Image from "next/image";

const CHECKBOX_ICON = {
  unchecked: "/img/checkbox/unchecked.png",
  checked: "/img/checkbox/checked.png",
};

export default function ItemEditor({ id }: { id: string }) {
  const { data, isLoading, error } = useItem(id);
  const update = useUpdateItem(id);
  const del = useDeleteItem(id);
  const router = useRouter();

  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name ?? "");
      setMemo(data.memo ?? "");
    }
  }, [data]);

  if (isLoading) return <div>불러오는 중…</div>;
  if (error || !data) return <div>항목을 불러오지 못했어요.</div>;

  const onSave = async () => {
    await update.mutateAsync({ name: name.trim(), memo });
    router.push("/");
  };

  const onDelete = async () => {
    if (!confirm("정말 삭제하시겠어요?")) return;
    await del.mutateAsync();
    router.push("/");
  };

  const toggleCompleted = () => update.mutate({ isCompleted: !data.isCompleted });
  const completed = !!data.isCompleted;

  return (
    <main className="mx-auto max-w-screen-lg space-y-5 px-4 py-3 md:px-6">
      <Header />
      <hr className="-mx-4 my-0 my-3 w-[100vw] border-gray-300 md:-mx-6" />
      <div
        className={`h-12 rounded-[18px] border-2 border-[var(--color-ink,#0F172A)] px-5 ${
          completed ? "bg-[var(--color-violet-100,#EDE9FE)]" : "bg-white"
        }`}
      >
        <div className="flex h-full items-center justify-center gap-3">
          <button
            type="button"
            aria-label="상태 토글"
            aria-pressed={completed}
            onClick={toggleCompleted}
            className="shrink-0"
          >
            <Image
              src={completed ? CHECKBOX_ICON.checked : CHECKBOX_ICON.unchecked}
              alt={completed ? "체크됨" : "체크 안 됨"}
              width={28}
              height={28}
              className="block"
            />
          </button>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="할 일 제목"
            className={[
              "w-full bg-transparent px-0 text-center underline line-through decoration-[var(--color-ink,#0F172A)] decoration-2 underline-offset-[3px] outline-none",
              "h-full leading-[3rem]",
              "caret-[var(--color-ink,#0F172A)]",
              completed
                ? "text-[var(--color-slate-500,#64748B)] underline line-through decoration-[var(--color-ink,#0F172A)] decoration-2 underline-offset-[3px]"
                : "text-[var(--color-ink,#0F172A)]",
              "placeholder:text-[var(--color-slate-400,#0F172A)]",
            ].join(" ")}
          />
        </div>
      </div>

      <div className="grid grid-cols-[minmax(240px,360px)_1fr] items-start gap-4">
        <ImageUploader
          imageUrl={data.imageUrl ?? ""}
          onUploaded={(url) => update.mutate({ imageUrl: url })}
          onClear={() => update.mutate({ imageUrl: null })}
          heightClass="h-48"
        />
        <div
          className={[
            "rounded-[14px] border border-[var(--color-amber-800,#92400E)] p-3",
            "flex flex-col",
            "h-48",
          ].join(" ")}
          style={{
            background:
              "linear-gradient(0deg, rgba(255,255,255,0.65), rgba(255,255,255,0.65)),repeating-linear-gradient(0deg,#FEF3C7,#FEF3C7 30px,#FDE68A 31px)",
          }}
        >
          <div className="mb-1 text-center text-sm font-semibold text-[var(--color-amber-800,#92400E)]">
            Memo
          </div>

          <div className="flex flex-1 items-center justify-center">
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="메모를 입력하세요"
              rows={5} // 최소 5줄 높이
              className="// 5줄 보장 (줄간격 1.5rem 기준) min-h-[140px] w-full flex-1 resize-none overflow-y-auto bg-transparent text-center leading-6 text-black outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mt-1 flex justify-end gap-3">
        <ImageButton
          preset={completed ? "active" : "save"}
          onClick={onSave}
          ariaLabel={completed ? "수정 완료 (활성)" : "수정 완료"}
        />
        <ImageButton preset="delete" onClick={onDelete} ariaLabel="삭제하기" />
      </div>
    </main>
  );
}
