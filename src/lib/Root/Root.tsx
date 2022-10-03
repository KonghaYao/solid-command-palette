import { Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { createKbdShortcuts } from '../createKbdShortcuts';
import { rootParentActionId } from '../constants';
import { Provider } from '../StoreContext';
import { RootProps, StoreState, StoreMethods } from '../types';
import { atom, atomization } from '@cn-ui/use';
import { createSearchResultList } from '../createActionList';
import { createStoreMethods } from './createStoreMethods';
import { TransformActionsProp } from './TransformActionsProp';

const RootInternal: Component = () => {
  createKbdShortcuts();
  return null;
};

export const Root: Component<RootProps> = (props) => {
  const initialActionsContext = props.actionsContext || {};
  const visibility = atomization(props.visibility ?? false);

  const [store, setStore] = createStore<StoreState>({
    visibility,
    searchText: '',
    activeParentActionIdList: [rootParentActionId],
    ...TransformActionsProp(props),
    actionsContext: {
      root: initialActionsContext,
      dynamic: {},
    },
    components: props.components,
    resultsList: atom([]),
  });
  setStore('resultsList', () => createSearchResultList(store));

  console.log(store.visibility, store.actions);
  const storeMethods: StoreMethods = createStoreMethods(setStore, store);

  return (
    <Provider value={[store, storeMethods]}>
      <RootInternal />
      {props.children}
    </Provider>
  );
};
