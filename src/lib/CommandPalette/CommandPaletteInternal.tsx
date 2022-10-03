import { Component, createEffect, createSignal, createUniqueId, onMount, onCleanup, Setter } from 'solid-js';
import tinykeys from 'tinykeys';
import { useStore } from '../StoreContext';
import { KbdShortcut } from '../KbdShortcut/KbdShortcut';
import { ScrollAssist } from '../ScrollAssist/ScrollAssist';
import { PanelResult } from '../Panel/Result/PanelResult';
import { PanelFooter } from '../Panel/Footer/Footer';
import { runAction } from '../actionUtils/actionUtils';
import { WrappedAction } from '../types';
import utilStyles from '../utils.module.css';
import styles from './CommandPalette.module.css';
import { CommandPaletteProps, ActiveItemId, UserInteraction, InputEventHandler } from './CommandPalette';
function triggerRun(action: WrappedAction) {
  const [state, storeMethods] = useStore();
  runAction(action, state.actionsContext, storeMethods);
}
export const CommandPaletteInternal: Component<CommandPaletteProps> = (p) => {
  const [state, storeMethods] = useStore();
  const { closePalette, setSearchText, revertParentAction } = storeMethods;
  const resultsList = state.resultsList;
  const [activeItemId, setActiveItemId] = createSignal<ActiveItemId>(null);
  const [userInteraction, setUserInteraction] = createSignal<UserInteraction>('idle');
  const searchLabelId = createUniqueId();
  const searchInputId = createUniqueId();
  const resultListId = createUniqueId();

  let wrapperElem: undefined | HTMLDivElement;
  let searchInputElem: undefined | HTMLInputElement;
  let closeBtnElem: undefined | HTMLButtonElement;
  let lastFocusedElem: null | HTMLElement;

  /** 相对位置选中菜单，正数 next */
  function activateItemWith(length: number) {
    const actionsList = resultsList();
    const currentActionIndex = actionsList.findIndex((action) => action.id === activeItemId());
    if (currentActionIndex < 0) {
      return;
    }

    const actionsCount = actionsList.length;
    const prevActionIndex = (actionsCount + currentActionIndex + length) % actionsCount;
    const prevActionId = actionsList[prevActionIndex].id;
    setActiveItemId(prevActionId);
  }

  function activatePrevItem() {
    activateItemWith(-1);
  }

  function activateNextItem() {
    activateItemWith(1);
  }

  function handleActionItemHover(action: WrappedAction) {
    setUserInteraction('navigate-mouse');
    setActiveItemId(action.id);
  }

  function handleKbdEnter(event: KeyboardEvent) {
    event.preventDefault();
    const targetElem = event.target as HTMLElement;
    if (closeBtnElem && closeBtnElem.contains(targetElem)) return;
    const activeActionId = activeItemId();
    if (!activeActionId) return null;
    const action = state.actionsMap()[activeActionId];
    triggerRun(action);
  }

  function getScrollAssistStatus() {
    switch (userInteraction()) {
      case 'navigate-mouse':
        return 'available';
      case 'navigate-scroll-assist':
        return 'running';
      default:
        return 'stopped';
    }
  }

  onMount(() => {
    lastFocusedElem = document.activeElement as HTMLElement;

    if (searchInputElem) {
      searchInputElem.select();
    }

    if (wrapperElem) BindKey(wrapperElem, handleKbdEnter, activateItemWith, setUserInteraction, setActiveItemId);
  });

  onCleanup(() => {
    if (lastFocusedElem) {
      lastFocusedElem.focus();
    }

    lastFocusedElem = null;
  });

  createEffect(() => {
    const actionsList = resultsList();
    const firstResultId = actionsList[0]?.id;

    if (firstResultId) {
      setActiveItemId(firstResultId);
    } else {
      setActiveItemId(null);
    }
  });

  return (
    <div
      class={styles.wrapper}
      ref={wrapperElem}
      onClick={() => closePalette()}
    >
      <div class={styles.palette}>
        <ScrollAssist
          direction="up"
          status={getScrollAssistStatus()}
          onNavigate={() => {
            setUserInteraction('navigate-scroll-assist');
            activatePrevItem();
          }}
          onStop={() => setUserInteraction('idle')}
        />
        <ScrollAssist
          direction="down"
          status={getScrollAssistStatus()}
          onNavigate={() => {
            setUserInteraction('navigate-scroll-assist');
            activateNextItem();
          }}
          onStop={() => setUserInteraction('idle')}
        />
        <div
          role="combobox"
          aria-expanded={true}
          aria-haspopup="listbox"
          aria-controls={resultListId}
          aria-activedescendant={`scp-result-item-${activeItemId()}`}
          aria-labelledby={searchLabelId}
          class={styles.panel}
          onClick={(e) => e.preventDefault()}
        >
          <form
            role="search"
            class={styles.searchForm}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label
              for={searchInputId}
              id={searchLabelId}
              class={utilStyles.visuallyHidden}
            >
              Search for an action and then select one of the option.
            </label>
            <input
              type="search"
              id={searchInputId}
              class={styles.searchInput}
              aria-autocomplete="list"
              autocomplete="off"
              autocapitalize="off"
              spellcheck={false}
              placeholder={p.searchPlaceholder || 'Type a command or search...'}
              data-cp-kbd-shortcuts="disabled"
              ref={searchInputElem}
              value={state.searchText}
              onInput={(event) => {
                const newValue = event.currentTarget.value;

                setUserInteraction('search');
                setSearchText(newValue);
              }}
            />
            <button
              type="button"
              class={styles.closeBtn}
              ref={closeBtnElem}
              onClick={() => {
                closePalette();
              }}
            >
              <span class={utilStyles.visuallyHidden}>Close the Command Palette</span>
              <KbdShortcut
                shortcut="Escape"
                aria-hidden
              />
            </button>
          </form>
          <PanelResult
            activeItemId={activeItemId()}
            resultsList={state.resultsList()}
            resultListId={resultListId}
            searchLabelId={searchLabelId}
            onActionItemHover={handleActionItemHover}
            onActionItemSelect={(action) => triggerRun(action)}
          />
          <PanelFooter />
        </div>
      </div>
    </div>
  );
};

/** 绑定面板的默认操作快捷键 */
function BindKey(
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
