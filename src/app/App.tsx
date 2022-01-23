import { Component, createSignal } from 'solid-js';
import { Root, CommandPalette } from '../lib';
import { actions } from './actions';

const App: Component = () => {
  const [count, setCount] = createSignal(0);

  const increment = () => {
    setCount((prev) => (prev += 1));
  };

  const actionsContext = {
    increment,
  };

  return (
    <Root actions={actions} actionsContext={actionsContext}>
      <div>
        <CommandPalette />
        <h1>Try the command palette by pressing CMD + K on Mac or Control + K on Windows</h1>
        <p>Count is {count()}</p>
        <button onClick={increment}>Increase Count</button>
      </div>
    </Root>
  );
};

export default App;
