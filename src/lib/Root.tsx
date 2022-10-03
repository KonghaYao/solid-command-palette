import { Component, JSXElement } from 'solid-js';
import { createStore, produce, SetStoreFunction } from 'solid-js/store';
import { createKbdShortcuts } from './createKbdShortcuts';
import { getActiveParentAction } from './actionUtils/actionUtils';
import { rootParentActionId } from './constants';
import { Provider } from './StoreContext';
import { RootProps, StoreState, StoreMethods, StoreContext, DynamicContextMap, Action, Actions } from './types';
import { atom, Atom, atomization, reflect } from '@cn-ui/use';
import { createSearchResultList } from './createActionList';

const RootInternal: Component = () => {
  createKbdShortcuts();
  return null;
};

export const Root: Component<RootProps & { children?: JSXElement }> = (props) => {
  let col: Pick<StoreState, 'actions' | 'actionsMap'>;
  if (props.actions instanceof Array || (typeof props.actions === 'function' && props.actions() instanceof Array)) {
    const actions = atomization(props.actions as Atom<Action[]>);
    const actionsMap = reflect(() => Object.fromEntries(actions().map((i) => [i.id, i]))),
      col = {
        actions,
        actionsMap,
      };
  } else {
    const actionsMap = atomization(props.actions as Atom<Actions>);
    const actions = reflect(() => Object.values(col.actions()));
    col = {
      actions,
      actionsMap,
    };
  }
  const initialActionsContext = props.actionsContext || {};
  const visibility = atomization(props.visibility ?? false);

  const [store, setStore] = createStore<StoreState>({
    visibility,
    searchText: '',
    activeParentActionIdList: [rootParentActionId],
    ...col!,
    actionsContext: {
      root: initialActionsContext,
      dynamic: {},
    },
    components: props.components,
    resultsList: atom([]),
  });
  setStore('resultsList', createSearchResultList(store));
  createSearchResultList(store);
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
