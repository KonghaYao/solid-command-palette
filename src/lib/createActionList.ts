import { createMemo, createEffect } from 'solid-js';
import Fuse from 'fuse.js';
import { checkActionAllowed, getActiveParentAction } from './actionUtils/actionUtils';
import { Action, ReactiveStore, StoreState, WrappedAction } from './types';
import { reflect } from '@cn-ui/use';
import { Atom } from 'solid-use';

export function createConditionalActionList(state: StoreState, actions: Atom<Action[]>) {
  return createMemo(() => {
    return actions()
      .filter((action: WrappedAction) => {
        const { activeId, isRoot } = getActiveParentAction(state.activeParentActionIdList);
        return isRoot || action.parentActionId === activeId;
      })
      .filter((action) => checkActionAllowed(action, state.actionsContext));
  });
}

export function createSearchResultList(store: StoreState, actions: Atom<Action[]>, searchText: Atom<string>) {
  const conditionalActionList = createConditionalActionList(store, actions);

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
  return reflect(() => {
    if (searchText().length === 0) {
      return conditionalActionList();
    }

    const searchResults = fuse.search(searchText());

    const resultsList = searchResults.map((result) => result.item);
    return resultsList;
  });
}
