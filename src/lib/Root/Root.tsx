import { Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { createKbdShortcuts } from '../createKbdShortcuts';
import { rootParentActionId } from '../constants';
import { Provider } from '../StoreContext';
import { RootProps, StoreState, StoreMethods, ReactiveStore } from '../types';
import { atomization } from '@cn-ui/use';
import { createSearchResultList } from '../createActionList';
import { createStoreMethods } from './createStoreMethods';
import { TransformActionsProp } from './TransformActionsProp';

const RootInternal: Component = () => {
  createKbdShortcuts();
  return null;
};

export const PaletteRoot: Component<RootProps> = (props) => {
  const initialActionsContext = props.actionsContext || {};
  const visibility = atomization(props.visibility ?? false);
  const searchText = atomization(props.searchText ?? '');
  const filters = atomization(props.filters ?? []);

  const [store, setStore] = createStore<StoreState>({
    activeParentActionIdList: [rootParentActionId],
    actionsContext: {
      root: initialActionsContext,
      dynamic: {},
    },
    components: props.components,
  });
  const actions = TransformActionsProp(props);
  const atoms: ReactiveStore = {
    searchText,
    visibility,
    filters,
    ...actions,
    resultsList: createSearchResultList(store, actions.actions, searchText, filters),
  };

  const storeMethods: StoreMethods = createStoreMethods(setStore, store, atoms);

  return (
    <Provider value={[store, storeMethods, atoms]}>
      <RootInternal />
      {props.children}
    </Provider>
  );
};
