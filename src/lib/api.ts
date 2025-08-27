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
  fd.append("image", file); // Swagger: 필드명은 image
  const { data } = await api.post("/images/upload", fd); // 헤더 직접 지정 X
  return (data?.url ?? data?.imageUrl) as string; // Swagger: { url }
};
