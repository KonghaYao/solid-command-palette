import { createMemo, createEffect } from 'solid-js';
import Fuse from 'fuse.js';
import { checkActionAllowed, getActiveParentAction } from './actionUtils/actionUtils';
import { StoreState, WrappedAction } from './types';

export function createConditionalActionList(state: StoreState) {
  return createMemo(() => {
    console.log(state.actions());
    return state
      .actions()
      .filter((action: WrappedAction) => {
        const { activeId, isRoot } = getActiveParentAction(state.activeParentActionIdList);
        return isRoot || action.parentActionId === activeId;
      })
      .filter((action) => checkActionAllowed(action, state.actionsContext));
  });
}

export function createSearchResultList(state: StoreState) {
  const conditionalActionList = createConditionalActionList(state);

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
