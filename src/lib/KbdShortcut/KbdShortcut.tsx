import { JSX, Component, For, splitProps } from 'solid-js';
import { getFormattedShortcut } from './utils';
import { ActionShortcut } from '../types';
import styles from './KbdShortcut.module.css';
import { OriginComponent } from '@cn-ui/use';

export interface KbdShortcutProps extends JSX.HTMLAttributes<HTMLElement> {
  shortcut: ActionShortcut;
}

export const KbdShortcut = OriginComponent<KbdShortcutProps>((props) => {
  const [l, others] = splitProps(props, ['shortcut']);

  const formattedShortcut = getFormattedShortcut(l.shortcut);

  return (
    <kbd
      {...others}
      ref={props.ref}
      class={styles.kbdShortcut}
    >
      <For each={formattedShortcut}>
        {(group) => (
          <kbd class={styles.kbdGroup}>
            <For each={group}>
              {(key) => (
                <kbd
                  class={props.class(styles.kbdKey)}
                  style={props.style}
                >
                  {key}
                </kbd>
              )}
            </For>
          </kbd>
        )}
      </For>
    </kbd>
  );
});
