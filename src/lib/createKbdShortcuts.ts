import { onMount, onCleanup } from 'solid-js';
import tinykeys from 'tinykeys';
import { useStore } from './StoreContext';
import { getShortcutHandlersMap } from './actionUtils/actionUtils';

type Unsubscribe = ReturnType<typeof tinykeys>;

/** 临时创建快捷键，在组件销毁时销毁 */
export function createKbdShortcuts() {
  const [state, storeMethods, atoms] = useStore();
  const { togglePalette } = storeMethods;
  const commandPaletteHandler = (event: KeyboardEvent) => {
    event.preventDefault();
    togglePalette();
  };

  const actionsList = atoms.actions;
  let unsubscribe: Unsubscribe;
  onMount(() => {
    const shortcutMap = getShortcutHandlersMap(actionsList(), state.actionsContext, storeMethods);

    unsubscribe = tinykeys(window, {
      ...shortcutMap,
      '$mod+k': commandPaletteHandler,
    });
  });

  onCleanup(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
}
