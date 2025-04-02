// การทำงานของ fetch ฝั่ง client
"use client";
import { useState, useEffect } from "react";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const FetchingPage = () => {
  const url = "https://jsonplaceholder.typicode.com/todos";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      setTodos(data);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {todos.map((todo, index) => {
        return (
          <div key={index}>
            <span>{todo.id}.) </span>
            <span>{todo.title}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FetchingPage;

// การทำงานของ fetch ฝั่ง server
// interface Todo {
//   userId: number;
//   id: number;
//   title: string;
//   completed: boolean;
// }

// const FetchingPage = async () => {
//   const url = "https://jsonplaceholder.typicode.com/todos";
//   //   const res = await fetch(url, { next: { revalidate: 10 } }); // ทำ cache 10 วินาที
//   const res = await fetch(url);
//   const todos: Todo[] = await res.json();

//   return (
//     <div>
//       {/* {todos.map((todo, index) => {
//         return (
//           <div key={index}>
//             <p>
//               {todo.id}) {todo.title}
//             </p>
//           </div>
//         );
//       })} */}
//       {todos.map((todo, index) => (
//         <div key={index}>
//           <span>{todo.id}.) </span>
//           <span>{todo.title}</span>
//         </div>
//       ))}
//       ;
//     </div>
//   );
// };
// export default FetchingPage;
