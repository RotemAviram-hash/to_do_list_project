import { createContext, useState, type ReactNode } from "react";

//יצירת הקונטקסט
const ExampleContext = createContext<any>(null);

//יצירת הפרוביידר
function ExampleProvider({ children }: { children: ReactNode }) {
  const [something, setSomething] = useState(10);

  return (
    <ExampleContext.Provider value={{ something, setSomething }}>
      {children}
    </ExampleContext.Provider>
  );
}

//custom hook for using the context
//
//
//
export { ExampleProvider, ExampleContext };
