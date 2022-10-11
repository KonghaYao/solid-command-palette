import { createMemo, createEffect } from 'solid-js';
import Fuse from 'fuse.js';
import { checkActionAllowed, getActiveParentAction } from './actionUtils/actionUtils';
import { Action, ActionFilter, ReactiveStore, StoreState, WrappedAction } from './types';
import { reflect, Atom } from '@cn-ui/use';

export function createConditionalActionList(state: StoreState, actions: Atom<Action[]>, filters: Atom<ActionFilter[]>) {
  const baseFilters = [
    (action: WrappedAction) => {
      const { activeId, isRoot } = getActiveParentAction(state.activeParentActionIdList);
      return isRoot || action.parentActionId === activeId;
    },
    (action) => checkActionAllowed(action, state.actionsContext),
  ] as ActionFilter[];

  const combineFilter = reflect(() => baseFilters.concat(filters()));

  return createMemo(() => {
    let items = actions();
    return combineFilter().reduce((items, it) => {
      return items.filter(it);
    }, items);
  });
}

export function createSearchResultList(
  store: StoreState,
  actions: Atom<Action[]>,
  searchText: Atom<string>,
  filters: Atom<ActionFilter[]>
) {
  const conditionalActionList = createConditionalActionList(store, actions, filters);

  console.log('创建 fuse');
  const fuse = new Fuse(conditionalActionList(), {
    ...(store?.fuseOptions || {}),
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
