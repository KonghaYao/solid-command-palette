import { createMemo, createEffect } from 'solid-js';
import Fuse from 'fuse.js';
import { useStore } from './StoreContext';
import { checkActionAllowed, getActiveParentAction } from './actionUtils/actionUtils';
import { WrappedAction } from './types';

export function createNestedActionList() {
  const [state] = useStore();
  const actionsList = state.actions;

  return createMemo(() => {
    return actionsList().filter((action: WrappedAction) => {
      const { activeId, isRoot } = getActiveParentAction(state.activeParentActionIdList);
      return isRoot || action.parentActionId === activeId;
    });
  });
}

export function createConditionalActionList() {
  const [state] = useStore();
  const nestedActionsList = createNestedActionList();

  return createMemo(() => {
    return nestedActionsList().filter((action) => checkActionAllowed(action, state.actionsContext));
  });
}

export function createSearchResultList() {
  const [state] = useStore();
  const conditionalActionList = createConditionalActionList();

  const fuse = new Fuse(conditionalActionList(), {
    keys: [
      {
        name: 'title',
        weight: 1,
      },
      {
        name: 'subtitle',
        weight: 0.7,
      },
      {
        name: 'keywords',
        weight: 0.5,
      },
    ],
  });
  createEffect(() => {
    fuse.setCollection(conditionalActionList());
  });
  return createMemo(() => {
    if (state.searchText.length === 0) {
      return conditionalActionList();
    }

    const searchResults = fuse.search(state.searchText);

    const resultsList = searchResults.map((result) => result.item);
    return resultsList;
  });
}
