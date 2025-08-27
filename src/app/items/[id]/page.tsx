import ItemEditor from "../../../components/ItemEditor";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ItemEditor id={id} />;
}
