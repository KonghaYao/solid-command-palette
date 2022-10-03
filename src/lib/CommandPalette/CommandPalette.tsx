import { Component, JSX, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { useStore } from '../StoreContext';
import { CommandPalettePortal } from './CommandPalettePortal';
import { ActionId } from '../types';
import styles from './CommandPalette.module.css';
import { CommandPaletteInternal } from './CommandPaletteInternal';

export type InputEventHandler = JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
export type ActiveItemId = null | ActionId;
export type UserInteraction = 'idle' | 'search' | 'navigate-kbd' | 'navigate-mouse' | 'navigate-scroll-assist';

export interface CommandPaletteProps {
  searchPlaceholder?: string;
  mount?: HTMLElement;
}

export const CommandPalette: Component<CommandPaletteProps> = (p) => {
  const [state, _, atoms] = useStore();

  return (
    <CommandPalettePortal mount={p.mount}>
      <Transition
        enterClass={styles.animEnter}
        enterActiveClass={styles.animEnterActive}
        exitClass={styles.animExit}
        exitActiveClass={styles.animExitActive}
      >
        <Show when={atoms.visibility()}>
          <CommandPaletteInternal {...p} />
        </Show>
      </Transition>
    </CommandPalettePortal>
  );
};
