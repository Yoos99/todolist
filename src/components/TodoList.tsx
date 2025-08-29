"use client";

import Image from "next/image";
import Link from "next/link";
import { useItems, useToggleItem } from "@/lib/queries";

const BADGE = {
  todo: "/img/badges/todo.png",
  done: "/img/badges/done.png",
} as const;

const EMPTY_IMG = {
  todo: "/img/empty-todo.png",
  done: "/img/empty-done.png",
} as const;

const CHECKBOX_ICON = {
  unchecked: "/img/checkbox/unchecked.png",
  checked: "/img/checkbox/checked.png",
} as const;

type Item = { id: string; name: string; isCompleted: boolean };

export default function TodoList() {
  const { data, isLoading, error } = useItems();

  if (isLoading) return <div className="text-sm text-slate-500">불러오는 중…</div>;
  if (error) return <div className="text-sm text-rose-600">목록을 불러오지 못했습니다.</div>;

  const items = data ?? [];
  const todo = items.filter((i) => !i.isCompleted);
  const done = items.filter((i) => i.isCompleted);

  return (
    <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
      <Section
        kind="todo"
        badgeSrc={BADGE.todo}
        items={todo}
        renderRow={(it) => <Row key={it.id} item={it} />}
      />
      <Section
        kind="done"
        badgeSrc={BADGE.done}
        items={done}
        renderRow={(it) => <Row key={it.id} item={it} />}
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
  items: Item[];
  renderRow: (it: Item) => React.ReactNode;
}) {
  const isEmpty = items.length === 0;

  return (
    <section>
      <Image
        src={badgeSrc}
        alt={kind === "todo" ? "TO DO" : "DONE"}
        width={120}
        height={40}
        className="mb-2 h-auto w-20 sm:mb-3 sm:w-24 lg:mb-4 lg:w-28"
        priority={false}
      />

      <div className={kind === "todo" ? "min-h-[160px] sm:min-h-[180px] lg:min-h-[220px]" : ""}>
        {isEmpty ? (
          <EmptyState kind={kind} />
        ) : (
          <ul className="space-y-2 sm:space-y-3">{items.map(renderRow)}</ul>
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
    <div className="grid place-items-center rounded-2xl py-3 text-center sm:py-4">
      <Image
        src={img}
        alt={title}
        width={220}
        height={160}
        className="mx-auto h-24 w-auto sm:h-32 lg:h-36"
      />
      <p className="mt-2 text-xs text-[var(--color-slate-500,#64748B)] sm:mt-3 sm:text-sm lg:text-base">
        {title}
        <br />
        {desc}
      </p>
    </div>
  );
}

function Row({ item }: { item: Item }) {
  const toggle = useToggleItem(item.id);
  const checked = item.isCompleted;

  return (
    <li
      className={[
        "flex items-center gap-2 rounded-full border-2 border-[var(--color-ink,#0F172A)] sm:gap-3",
        "px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3",
        checked ? "bg-violet-100" : "bg-white",
      ].join(" ")}
    >
      <button
        type="button"
        aria-label={checked ? "완료로 표시됨" : "진행 중으로 표시됨"}
        aria-pressed={checked}
        onClick={() => toggle.mutate(!checked)}
        className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
      >
        <Image
          src={checked ? CHECKBOX_ICON.checked : CHECKBOX_ICON.unchecked}
          alt=""
          width={32}
          height={32}
          className="block h-auto w-6 sm:w-7 lg:w-8"
        />
      </button>

      <Link
        href={`/items/${item.id}`}
        className="min-w-0 flex-1 truncate"
        aria-label={`${item.name} 상세로 이동`}
      >
        <span
          className={[
            "text-sm sm:text-base lg:text-lg",
            checked ? "text-[var(--color-slate-500,#64748B)] line-through" : "text-slate-900",
          ].join(" ")}
        >
          {item.name}
        </span>
      </Link>
    </li>
  );
}
