"use client";

import { useState, useEffect } from "react";

const ClientPage = () => {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e);
    setInput(e.target.value);
  };

  const handleClick = () => {
    setName(input);
  };

  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(count);
  }, [count]);

  const handleCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>{name}</h1>
      <input type="text" onChange={(e) => handleInput(e)} />
      <button onClick={handleClick}>Change Name</button>
      <br />
      <div>{count}</div>
      <button onClick={handleCount}>Add Count</button>
    </div>
  );
};
export default ClientPage;
