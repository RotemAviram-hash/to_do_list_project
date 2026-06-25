import { useContext } from "react";
import { ExampleContext } from "../../providers/ExampleProvider";

function Child() {
  const { setSomething } = useContext(ExampleContext);

  return (
    <div>
      <p>this is child component</p>
      <button onClick={() => setSomething((prev: number) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Child;
