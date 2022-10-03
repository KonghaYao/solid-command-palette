import { Component, createEffect } from 'solid-js';
import { useStore } from '../../StoreContext';
import { WrappedAction } from '../../types';
import { Dynamic } from 'solid-js/web';
import { ResultContent } from './ResultContent';
import { ResultItemProps, ResultItemElem } from './interface';

export const ResultItem: Component<ResultItemProps> = (p) => {
  let resultItemElem: ResultItemElem;
  let isMoving = false;

  const [state] = useStore();
  const ResultContentComponent = state.components?.ResultContent || ResultContent;

  const isActive = () => p.action.id === p.activeItemId;

  function handleMouseMove(action: WrappedAction) {
    if (isMoving) return;
    isMoving = true;
    p.onActionItemHover(action);
  }

  createEffect(() => {
    if (isActive() && resultItemElem) {
      resultItemElem.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  });

  return (
    <li
      role="option"
      ref={resultItemElem}
      id={`scp-result-item-${p.action.id}`}
      aria-selected={isActive()}
      onClick={[p.onActionItemSelect, p.action]}
      onMouseMove={[handleMouseMove, p.action]}
      onMouseLeave={() => (isMoving = false)}
      onMouseDown={(event: MouseEvent) => {
        // don't take focus away from search field when item is clicked.
        event.preventDefault();
      }}
    >
      <Dynamic
        component={ResultContentComponent}
        isActive={isActive()}
        action={p.action}
      />
    </li>
  );
};
