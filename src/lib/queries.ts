"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Item } from "./types";
import { createItem, deleteItem, getItem, getItems, updateItem } from "./api";

export const useItems = () =>
  useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: getItems,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });

export const useItem = (id: string) =>
  useQuery<Item>({
    queryKey: ["item", id],
    queryFn: () => getItem(id),
    enabled: !!id, // 안전장치
    staleTime: 10_000,
  });

export const useCreateItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createItem(name),
    onSuccess: (newItem) => {
      qc.setQueryData<Item[]>(["items"], (old = []) => [newItem, ...old]);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });
};

export const useUpdateItem = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Pick<Item, "name" | "memo" | "imageUrl" | "isCompleted">>) =>
      updateItem(id, patch),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: ["items"] });
      await qc.cancelQueries({ queryKey: ["item", id] });

      const prevList = qc.getQueryData<Item[]>(["items"]);
      const prevOne = qc.getQueryData<Item>(["item", id]);

      if (prevList) {
        qc.setQueryData<Item[]>(
          ["items"],
          prevList.map((i) => (i.id === id ? ({ ...i, ...patch } as Item) : i))
        );
      }
      if (prevOne) {
        qc.setQueryData<Item>(["item", id], { ...prevOne, ...patch } as Item);
      }

      return { prevList, prevOne };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prevList) qc.setQueryData(["items"], ctx.prevList);
      if (ctx?.prevOne) qc.setQueryData(["item", id], ctx.prevOne);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["items"] });
      qc.invalidateQueries({ queryKey: ["item", id] });
    },
  });
};

export const useToggleItem = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (isCompleted: boolean) => updateItem(id, { isCompleted }),
    onMutate: async (isCompleted) => {
      await qc.cancelQueries({ queryKey: ["items"] });
      const prev = qc.getQueryData<Item[]>(["items"]);
      qc.setQueryData<Item[]>(["items"], (old = []) =>
        old.map((i) => (i.id === id ? { ...i, isCompleted } : i))
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["items"], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });
};

export const useDeleteItem = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteItem(id),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["items"] });
      const prev = qc.getQueryData<Item[]>(["items"]);
      qc.setQueryData<Item[]>(["items"], (old = []) => old.filter((i) => i.id !== id));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx?.prev && qc.setQueryData(["items"], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ["items"] }),
  });
};
