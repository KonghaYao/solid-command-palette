import { produce, SetStoreFunction } from 'solid-js/store';
import { getActiveParentAction } from '../actionUtils/actionUtils';
import { rootParentActionId } from '../constants';
import { StoreState, StoreMethods, DynamicContextMap, ReactiveStore } from '../types';
import { Atom } from '@cn-ui/use';

/** 创建整个信息管理的方法函数 */
export function createStoreMethods(
  setStore: SetStoreFunction<StoreState>,
  store: StoreState,
  atoms: ReactiveStore
): StoreMethods {
  const resetParentAction = () => {
    setStore('activeParentActionIdList', [rootParentActionId]);
  };
  return {
    resetParentAction,

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
      atoms.visibility(true);
    },
    closePalette() {
      atoms.visibility(false);

      const hasActiveParent = store.activeParentActionIdList.length > 1;

      if (hasActiveParent) {
        atoms.searchText('');
        resetParentAction();
      }
    },
    togglePalette() {
      atoms.visibility((i) => !i);
    },
    selectParentAction(parentActionId) {
      if (parentActionId === rootParentActionId) {
        return;
      }

      setStore('activeParentActionIdList', (old) => {
        return [...old, parentActionId];
      });
      atoms.searchText('');
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
