import Header from "@/components/Header";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";

export default function Page() {
  return (
    <main className="mx-auto max-w-screen-lg px-4 py-3 md:px-6">
      <Header />
      <hr className="my-3 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-[100vw] border-gray-300" />
      <TodoInput />
      <div className="mt-6">
        <TodoList />
      </div>
    </main>
  );
}
