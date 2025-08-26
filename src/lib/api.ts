import axios from "axios";
import type { Item } from "./types";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/${process.env.NEXT_PUBLIC_TENANT_ID}`,
});

// Items
export const getItems = async (): Promise<Item[]> => (await api.get("/items")).data;
export const getItem = async (id: string): Promise<Item> => (await api.get(`/items/${id}`)).data;
export const createItem = async (name: string): Promise<Item> =>
  (await api.post("/items", { name })).data;
export const updateItem = async (
  id: string,
  body: Partial<Pick<Item, "name" | "memo" | "imageUrl" | "isCompleted">>
): Promise<Item> => (await api.patch(`/items/${id}`, body)).data;
export const deleteItem = async (id: string) => {
  await api.delete(`/items/${id}`);
};

// Image upload → imageUrl 반환
export const uploadImage = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append("file", file);
  const { data } = await api.post(`/images/upload`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.imageUrl as string;
};
