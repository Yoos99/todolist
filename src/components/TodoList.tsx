"use client";

import Image from "next/image";
import Link from "next/link";
import { useItems, useToggleItem } from "@/lib/queries";

const BADGE = {
  todo: "/img/badges/todo.png",
  done: "/img/badges/done.png",
};

const EMPTY_IMG = {
  todo: "/img/empty-todo.png",
  done: "/img/empty-done.png",
};

const CHECKBOX_ICON = {
  unchecked: "/img/checkbox/unchecked.png",
  checked: "/img/checkbox/checked.png",
};

export default function TodoList() {
  const { data, isLoading, error } = useItems();
  if (isLoading) return <div>목록을 불러오는 중…</div>;
  if (error) return <div>에러발생! 목록을 불러오지 못했습니다.</div>;

  const todo = (data ?? []).filter((i) => !i.isCompleted);
  const done = (data ?? []).filter((i) => i.isCompleted);
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Section
        kind="todo"
        badgeSrc={BADGE.todo}
        items={todo}
        renderRow={(it) => <Row key={it.id} id={it.id} name={it.name} checked={it.isCompleted} />}
      />
      <Section
        kind="done"
        badgeSrc={BADGE.done}
        items={done}
        renderRow={(it) => <Row key={it.id} id={it.id} name={it.name} checked={it.isCompleted} />}
      />
    </div>
  );
}

function Section({
  kind,
  badgeSrc,
  items,
  renderRow,
}: {
  kind: "todo" | "done";
  badgeSrc: string;
  items: Array<{ id: string; name: string; isCompleted: boolean }>;
  renderRow: (it: { id: string; name: string; isCompleted: boolean }) => React.ReactNode;
}) {
  const isEmpty = items.length === 0;

  return (
    <section>
      <Image
        src={badgeSrc}
        alt={kind === "todo" ? "TO DO" : "DONE"}
        width={80}
        height={30}
        className="mb-3"
      />
      <div className={[kind === "todo" ? "min-h-[180px] md:min-h-[200px]" : ""].join(" ")}>
        {isEmpty ? (
          <EmptyState kind={kind} />
        ) : (
          <ul className="space-y-2">{items.map(renderRow)}</ul>
        )}
      </div>
    </section>
  );
}

function EmptyState({ kind }: { kind: "todo" | "done" }) {
  const img = kind === "todo" ? EMPTY_IMG.todo : EMPTY_IMG.done;
  const title = kind === "todo" ? "할 일이 없어요." : "완료된 일이 없어요.";
  const desc = kind === "todo" ? "TODO를 새로 추가해보세요!" : "해야 할 일을 완료해보세요!";

  return (
    <div className="grid place-items-center rounded-2xl bg-transparent py-4 text-center">
      <Image src={img} alt={title} width={220} height={160} className="mx-auto h-32 w-auto" />
      <p className="mt-3 text-sm text-[var(--color-slate-500,#64748B)]">
        {title}
        <br />
        {desc}
      </p>
    </div>
  );
}

function Row({ id, name, checked }: { id: string; name: string; checked: boolean }) {
  const toggle = useToggleItem(id);

  return (
    <li
      className={[
        "flex items-center gap-3 rounded-full border-2 border-[var(--color-ink,#0F172A)] px-4 py-2",
        checked ? "bg-violet-100" : "bg-white",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label="상태 토글"
        aria-pressed={checked}
        onClick={() => toggle.mutate(!checked)}
        className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
      >
        <Image
          src={checked ? CHECKBOX_ICON.checked : CHECKBOX_ICON.unchecked}
          alt={checked ? "체크됨" : "체크 안 됨"}
          width={28}
          height={28}
          className="block"
        />
      </button>

      <Link
        href={`/items/${id}`}
        className="min-w-0 flex-1 truncate"
        aria-label={`${name} 상세로 이동`}
      >
        <span
          className={[
            "text-base",
            checked ? "text-[var(--color-slate-500,#64748B)] line-through" : "text-slate-900",
          ].join(" ")}
        >
          {name}
        </span>
      </Link>
    </li>
  );
}
