import { useContext } from "react";
import Parent from "./Parent";
import { ExampleContext } from "../../providers/ExampleProvider";
function GrandParent() {
  const { something } = useContext(ExampleContext);
  return (
    <div>
      this is grandparent component {something}
      <Parent />
    </div>
  );
}

export default GrandParent;
