import { Atom } from '@cn-ui/use';
import { Setter } from 'solid-js';
import tinykeys from 'tinykeys';
import { useStore } from '../StoreContext';
import { ActiveItemId, UserInteraction } from './CommandPalette';

/**
 * @zh 绑定面板的默认操作快捷键
 */
export function BindCommandKey(
  wrapperElem: HTMLDivElement,
  handleKbdEnter: (event: KeyboardEvent) => null | undefined,
  activateItemWith: (len: number) => void,
  userInteraction: Atom<UserInteraction>,
  activeItemId: Atom<ActiveItemId>
) {
  const [state, storeMethods, atoms] = useStore();
  const { closePalette, revertParentAction } = storeMethods;

  tinykeys(wrapperElem, {
    Escape: (event) => {
      event.preventDefault();
      closePalette();
    },
    Enter: handleKbdEnter,
    ArrowUp(event: KeyboardEvent) {
      event.preventDefault();
      userInteraction('navigate-kbd');
      activateItemWith(-1);
    },
    ArrowDown(event: KeyboardEvent) {
      event.preventDefault();
      userInteraction('navigate-kbd');
      activateItemWith(1);
    },
    PageUp(event: KeyboardEvent) {
      event.preventDefault();

      const actionsList = atoms.resultsList();
      const firstAction = actionsList[0];

      if (firstAction) {
        userInteraction('navigate-kbd');
        activeItemId(firstAction.id);
      }
    },
    PageDown(event: KeyboardEvent) {
      event.preventDefault();

      const actionsList = atoms.resultsList();
      const lastAction = actionsList.at(-1);

      if (lastAction) {
        userInteraction('navigate-kbd');
        activeItemId(lastAction.id);
      }
    },
    Backspace() {
      const isSearchEmpty = atoms.searchText().length <= 0;
      if (isSearchEmpty) {
        revertParentAction();
      }
    },
  });
}
