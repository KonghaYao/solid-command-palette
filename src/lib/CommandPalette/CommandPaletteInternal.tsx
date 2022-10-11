import { Component, createEffect, createSignal, createUniqueId, onMount, onCleanup } from 'solid-js';
import { useStore } from '../StoreContext';
import { KbdShortcut } from '../KbdShortcut/KbdShortcut';
import { ScrollAssist } from '../ScrollAssist/ScrollAssist';
import { PanelResult } from '../Panel/Result/PanelResult';
import { PanelFooter } from '../Panel/Footer/Footer';
import { runAction } from '../actionUtils/actionUtils';
import { WrappedAction } from '../types';
import utilStyles from '../utils.module.css';
import styles from './CommandPalette.module.css';
import { CommandPaletteProps, ActiveItemId, UserInteraction } from './CommandPalette';
import { BindCommandKey } from './BindCommandKey';
import { atom } from '@cn-ui/use';

export const CommandPaletteInternal: Component<CommandPaletteProps> = (p) => {
  const [state, storeMethods, atoms] = useStore();

  const { closePalette } = storeMethods;

  const activeItemId = atom<ActiveItemId>(atoms.actions()[0]?.id || null);
  const userInteraction = atom<UserInteraction>('idle');
  const searchLabelId = createUniqueId();
  const searchInputId = createUniqueId();
  const resultListId = createUniqueId();

  /** 触发 action  */
  function triggerRun(action: WrappedAction) {
    runAction(action, state.actionsContext, storeMethods);
  }
  let wrapperElem: undefined | HTMLDivElement;
  let searchInputElem: undefined | HTMLInputElement;
  let closeBtnElem: undefined | HTMLButtonElement;
  let lastFocusedElem: null | HTMLElement;

  /**
   * @zh 使用相对位置选中菜单
   */
  function activateItemWith(length: number) {
    const actionsList = atoms.actions();
    const active = activeItemId();
    const currentActionIndex = actionsList.findIndex((action) => action.id === active);

    if (currentActionIndex < 0) {
      return;
    }

    const actionsCount = actionsList.length;
    const newActionIndex = (actionsCount + currentActionIndex + length) % actionsCount;
    const newActionId = actionsList[newActionIndex].id;
    activeItemId(newActionId);
  }

  /** @zh 处理键盘的 enter 事件 */
  function handleKbdEnter(event: KeyboardEvent) {
    event.preventDefault();
    const targetElem = event.target as HTMLElement;
    if (closeBtnElem && closeBtnElem.contains(targetElem)) return;
    const activeActionId = activeItemId();
    if (!activeActionId) return null;
    const action = atoms.actionsMap()[activeActionId];
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

    if (wrapperElem) BindCommandKey(wrapperElem, handleKbdEnter, activateItemWith, userInteraction, activeItemId);
  });

  onCleanup(() => {
    if (lastFocusedElem) {
      lastFocusedElem.focus();
    }

    lastFocusedElem = null;
  });
  const Main = state.components?.Main;
  return (
    <div
      class={styles.wrapper}
      ref={wrapperElem}
      onClick={(e) => {
        // 点击遮罩关闭
        e.target === wrapperElem && closePalette();
      }}
    >
      <div class={styles.palette}>
        <ScrollAssist
          direction="up"
          status={getScrollAssistStatus()}
          onNavigate={() => {
            userInteraction('navigate-scroll-assist');
            activateItemWith(-1);
          }}
          onStop={() => userInteraction('idle')}
        />
        <ScrollAssist
          direction="down"
          status={getScrollAssistStatus()}
          onNavigate={() => {
            userInteraction('navigate-scroll-assist');
            activateItemWith(1);
          }}
          onStop={() => userInteraction('idle')}
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
            onSubmit={(event) => event.preventDefault()}
          >
            <label
              for={searchInputId}
              id={searchLabelId}
              class={utilStyles.visuallyHidden}
            >
              {p.footnote || 'Search for an action and then select one of the option.'}
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
              value={atoms.searchText()}
              onInput={(event) => {
                const newValue = event.currentTarget.value;

                userInteraction('search');
                atoms.searchText(newValue);
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
          {Main && <Main></Main>}
          <PanelResult
            activeItemId={activeItemId()}
            resultsList={atoms.resultsList()}
            resultListId={resultListId}
            searchLabelId={searchLabelId}
            onActionItemHover={(action: WrappedAction) => {
              userInteraction('navigate-mouse');
              activeItemId(action.id);
            }}
            onActionItemSelect={(action) => triggerRun(action)}
          />
          <PanelFooter />
        </div>
      </div>
    </div>
  );
};
