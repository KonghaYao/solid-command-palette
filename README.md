<p align="center">
  <br />
  <img src="./public/images/branding/logo-light-horizontal-large.png" width="650" alt="Command Palette for Solid.js" />
  <br />
</p>

<h1 align="center">Boost your users productivity by 10x 🚀</h1>

<br />

### Some of the features offered by this library-

1. Define actions with a simple config.
2. Full keyboard support like open with <kbd>CMD</kbd> + <kbd>K</kbd>, navigate between actions using arrow keys.
3. Fuzzy search between your actions on title, subtile, keywords.
4. Bind custom keyboard shortcuts to your actions. They can be single letter, modifier combinations <kbd>Shift</kbd> + <kbd>l</kbd> or sequences <kbd>g</kbd> <kbd>p</kbd>.
5. Enable actions based on dynamic conditions.
6. Share your app state and methods to run any kind of functionality from actions.
7. Full static type safety across the board.

8. Use atom-like reactive object to control your palette.

## Demo

![Solid Command Palette Demo](./public/images/demo-minimal.gif)

Try the full demo on [our documentation site](https://@cn-ui/command-palette.vercel.app/demo).

## Usage

#### Install the library

```sh
# Core Library
npm install @cn-ui/command-palette

# Peer Dependencies
npm install solid-transition-group tinykeys fuse.js @cn-ui/use
```

- [solid-transition-group](https://github.com/solidjs/solid-transition-group) (1.6KB): provides advanced animation support. It's the official recommendation from SolidJS team so you might be using it already.
- [tinykeys](https://github.com/jamiebuilds/tinykeys) (700B): provides keyboard shortcut support. You can use this in your app for all kinds of keybindings.
- [fuse.js](https://github.com/krisk/fuse) (5KB): provides fuzzy search support to find relevant actions.
- [@cn-ui/use](https://npm.im/@cn-ui/use) (5KB): provides many useful util for solid-js developer.

#### Integrate with app

```jsx
// define actions in one module say `actions.ts`

import { defineAction } from '@cn-ui/command-palette';

const minimalAction = defineAction({
  id: 'minimal',
  title: 'Minimal Action',
  run: () => {
    console.log('ran minimal action');
  },
});

const incrementCounterAction = defineAction({
  id: 'increment-counter',
  title: 'Increment Counter by 1',
  subtitle: 'Press CMD + E to trigger this.',
  shortcut: '$mod+e', // $mod = Command on Mac & Control on Windows.
  run: ({ rootContext }) => {
    rootContext.increment();
  },
});

export const actions = {
  [minimalAction.id]: minimalAction,
  [incrementCounterAction.id]: incrementCounterAction,
};

// If you are lazy to write id, then just give an array!
export const actions = [minimalAction, incrementCounterAction];
```

```jsx
// render inside top level Solid component

import { Root, CommandPalette } from '@cn-ui/command-palette';
import { atom } from '@cn-ui/use';
import { actions } from './actions';
import '@cn-ui/command-palette/pkg-dist/style.css';

const App = () => {
  const actionsContext = {
    increment() {
      console.log('increment count state by 1');
    },
  };
  const actionController = atom(actions);

  return (
    <div class="my-app">
      <Root
        actions={actionController} // or you can just put actions to there without reactive
        actionsContext={actionsContext}
      >
        <CommandPalette />
      </Root>
    </div>
  );
};
```
