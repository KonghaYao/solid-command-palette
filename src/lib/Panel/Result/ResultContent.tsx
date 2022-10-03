import { Component, Show } from 'solid-js';
import { KbdShortcut } from '../../KbdShortcut/KbdShortcut';
import { ResultContentProps } from '../../types';
import utilStyles from '../../utils.module.css';
import styles from './Result.module.css';

export const ResultContent: Component<ResultContentProps> = (p) => {
  return (
    <div
      class={styles.resultContent}
      classList={{
        [styles.active]: p.isActive,
      }}
    >
      <div>
        <h4 class={`${styles.resultTitle} ${utilStyles.stripSpace}`}>{p.action.title}</h4>
        <Show when={p.action.subtitle}>
          <p class={`${styles.resultSubtitle} ${utilStyles.stripSpace}`}>{p.action.subtitle}</p>
        </Show>
      </div>
      <div>
        <Show when={!!p.action.shortcut}>
          <KbdShortcut
            class={styles.resultShortcut}
            shortcut={p.action.shortcut || ''}
          />
        </Show>
      </div>
    </div>
  );
};
