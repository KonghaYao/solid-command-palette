import { produce, SetStoreFunction } from 'solid-js/store';
import { getActiveParentAction } from '../actionUtils/actionUtils';
import { rootParentActionId } from '../constants';
import { StoreState, StoreMethods, DynamicContextMap } from '../types';
import { Atom } from '@cn-ui/use';

/** 创建整个信息管理的方法函数 */
export function createStoreMethods(setStore: SetStoreFunction<StoreState>, store: StoreState): StoreMethods {
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
