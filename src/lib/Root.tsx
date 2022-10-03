import { Component, JSXElement } from 'solid-js';
import { createStore, produce, SetStoreFunction } from 'solid-js/store';
import { createKbdShortcuts } from './createKbdShortcuts';
import { getActiveParentAction } from './actionUtils/actionUtils';
import { rootParentActionId } from './constants';
import { Provider } from './StoreContext';
import { RootProps, StoreState, StoreMethods, StoreContext, DynamicContextMap } from './types';
import { Atom, atomization, reflect } from '@cn-ui/use';

const RootInternal: Component = () => {
  createKbdShortcuts();
  return null;
};

export const Root: Component<RootProps & { children?: JSXElement }> = (props) => {
  const initialActions = atomization(props.actions);
  const initialActionsContext = props.actionsContext || {};
  const visibility = atomization(props.visibility ?? false);

  const [store, setStore] = createStore<StoreState>({
    visibility,
    searchText: '',
    activeParentActionIdList: [rootParentActionId],
    actions: initialActions,
    actionsMap: reflect(() => Object.fromEntries(initialActions().map((i) => [i.id, i]))),
    actionsContext: {
      root: initialActionsContext,
      dynamic: {},
    },
    components: props.components,
  });

  const storeMethods: StoreMethods = createStoreMethods(setStore, store);

  return (
    <Provider value={[store, storeMethods]}>
      <RootInternal />
      {props.children}
    </Provider>
  );
};

/** 创建整个信息管理的方法函数 */
function createStoreMethods(setStore: SetStoreFunction<StoreState>, store: StoreState): StoreMethods {
  const setSearchText = (newValue: string) => {
    setStore('searchText', newValue);
  };
  const resetParentAction = () => {
    setStore('activeParentActionIdList', [rootParentActionId]);
  };
  return {
    resetParentAction,
    setSearchText,
    setActionsContext(actionId, newData) {
      setStore('actionsContext', 'dynamic', actionId, newData);
    },
    resetActionsContext(actionId) {
      setStore(
        'actionsContext',
        'dynamic',
        produce<DynamicContextMap>((dynamicContext) => {
          delete dynamicContext[actionId];
        })
      );
    },
    openPalette() {
      setStore('visibility', 'opened');
    },
    closePalette() {
      setStore('visibility', 'closed');

      const hasActiveParent = store.activeParentActionIdList.length > 1;

      if (hasActiveParent) {
        setSearchText('');
        resetParentAction();
      }
    },
    togglePalette() {
      setStore('visibility', (prev: Atom<boolean>) => {
        prev((i) => !i);
        return prev;
      });
    },
    selectParentAction(parentActionId) {
      if (parentActionId === rootParentActionId) {
        return;
      }

      setStore('activeParentActionIdList', (old) => {
        return [...old, parentActionId];
      });
      setSearchText('');
    },
    revertParentAction() {
      setStore('activeParentActionIdList', (old) => {
        const { isRoot } = getActiveParentAction(old);
        if (isRoot) {
          return old;
        }

        const copiedList = [...old];
        copiedList.pop();

        return copiedList;
      });
    },
  };
}
