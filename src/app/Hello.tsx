interface HelloProps {
  name: string;
  age?: number;
}

// Destructuring props in functional component
const Hello = ({ name, age }: HelloProps) => {
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>You are {age} years old</p>
    </div>
  );
};

export default Hello;
