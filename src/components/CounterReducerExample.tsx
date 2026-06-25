import { useReducer } from "react";


function counterReducer (state: {count:number,step:number}, action: { type: string,payload?: number }) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'reset':
      return { ...state, count: 0 };
      case 'setStep':
      return { ...state, step: action.payload ?? state.step };
    default:
      throw new Error();
  }
}

function CounterReducerExample() {
  const [{ count, step }, dispatch] = useReducer(counterReducer, {count:0,step:1});

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        Decrement
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>

      <div>
        <label>
          Step:
          <input
            type="number"
            value={step}
            onChange={(e) => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
          />
        </label>
      </div>
    </div>
  );
}

export default CounterReducerExample;
