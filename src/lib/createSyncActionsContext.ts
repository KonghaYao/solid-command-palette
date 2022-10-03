import { createEffect, onCleanup } from 'solid-js';
import { useStore } from './StoreContext';
import { CreateSyncActionsContext } from './types';

/** unknown */
export const createSyncActionsContext: CreateSyncActionsContext = (actionId, callback) => {
  const [_state, { setActionsContext, resetActionsContext }] = useStore();

  createEffect(() => {
    const data = callback();
    setActionsContext(actionId, data);
  });

  onCleanup(() => {
    resetActionsContext(actionId);
  });
};
