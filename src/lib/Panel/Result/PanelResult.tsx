import { Component, For } from 'solid-js';
import utilStyles from '../../utils.module.css';
import styles from './Result.module.css';
import { ResultItem } from './ResultItem';
import { PanelResultProps } from './interface';

export const PanelResult: Component<PanelResultProps> = (p) => {
  return (
    <div class={styles.resultWrapper}>
      <ul
        role="listbox"
        id={p.resultListId}
        aria-labelledby={p.searchLabelId}
        class={`${styles.resultList} ${utilStyles.stripSpace}`}
      >
        <For
          each={p.resultsList}
          fallback={
            <div
              class={styles.resultItem}
              style="padding:2em"
            >
              <h4 class={`${styles.resultTitle} ${utilStyles.stripSpace}`}>Couldn't find any matching actions</h4>
            </div>
          }
        >
          {(action) => (
            <ResultItem
              action={action}
              activeItemId={p.activeItemId}
              onActionItemHover={p.onActionItemHover}
              onActionItemSelect={p.onActionItemSelect}
            />
          )}
        </For>
      </ul>
    </div>
  );
};
