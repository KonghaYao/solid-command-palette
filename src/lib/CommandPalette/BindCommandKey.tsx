import { Setter } from 'solid-js';
import tinykeys from 'tinykeys';
import { useStore } from '../StoreContext';
import { ActiveItemId, UserInteraction } from './CommandPalette';

/** 绑定面板的默认操作快捷键 */
export function BindCommandKey(
  wrapperElem: HTMLDivElement,
  handleKbdEnter: (event: KeyboardEvent) => null | undefined,
  activateItemWith: (len: number) => void,
  setUserInteraction: Setter<UserInteraction>,
  setActiveItemId: Setter<ActiveItemId>
) {
  const [state, storeMethods] = useStore();
  const { closePalette, revertParentAction } = storeMethods;

  tinykeys(wrapperElem, {
    Escape: (event) => {
      event.preventDefault();
      closePalette();
    },
    Enter: handleKbdEnter,
    ArrowUp(event: KeyboardEvent) {
      event.preventDefault();
      setUserInteraction('navigate-kbd');
      activateItemWith(-1);
    },
    ArrowDown(event: KeyboardEvent) {
      event.preventDefault();
      setUserInteraction('navigate-kbd');
      activateItemWith(1);
    },
    PageUp(event: KeyboardEvent) {
      event.preventDefault();

      const actionsList = state.resultsList();
      const firstAction = actionsList[0];

      if (firstAction) {
        setUserInteraction('navigate-kbd');
        setActiveItemId(firstAction.id);
      }
    },
    PageDown(event: KeyboardEvent) {
      event.preventDefault();

      const actionsList = state.resultsList();
      const lastAction = actionsList.at(-1);

      if (lastAction) {
        setUserInteraction('navigate-kbd');
        setActiveItemId(lastAction.id);
      }
    },
    Backspace() {
      const isSearchEmpty = state.searchText.length <= 0;
      if (isSearchEmpty) {
        revertParentAction();
      }
    },
  });
}
