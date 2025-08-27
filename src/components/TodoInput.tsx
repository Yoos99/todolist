"use client";
import { useState, FormEvent } from "react";
import Input from "./ui/Input";
import ImageButton from "@/components/ui/ImageButton";
import { useCreateItem } from "@/lib/queries";

export default function TodoInput() {
  const [v, setV] = useState("");
  const create = useCreateItem();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = v.trim();
    if (!name) return;
    await create.mutateAsync(name);
    setV("");
  };

  const disabled = create.isPending || v.trim().length === 0;

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2">
      <Input
        placeholder="할 일을 입력해주세요"
        value={v}
        onChange={(e) => setV(e.target.value)}
        disabled={create.isPending}
        className="text-black"
      />
      <ImageButton preset="add" type="submit" />
    </form>
  );
}
