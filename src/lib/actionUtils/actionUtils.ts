import { KeyBindingMap } from 'tinykeys';
import { rootParentActionId } from '../constants';
import { ActionId, ActionsContext, StoreMethods, WrappedAction, WrappedActionList } from '../types';

type RunStoreMethods = {
  selectParentAction: StoreMethods['selectParentAction'];
  closePalette: StoreMethods['closePalette'];
};

function getActionContext(action: WrappedAction, actionsContext: ActionsContext) {
  const rootContext = actionsContext.root;
  const dynamicContext = actionsContext.dynamic[action.id] || {};

  return {
    rootContext,
    dynamicContext,
  };
}

/**
 * @zh 通过 action.cond 判断是否被忽略
 */
export function checkActionAllowed(action: WrappedAction, actionsContext: ActionsContext) {
  if (!action.cond) {
    return true;
  }
  const { rootContext, dynamicContext } = getActionContext(action, actionsContext);
  return action.cond({ actionId: action.id, rootContext, dynamicContext, action });
}

/**
 * @zh 执行 action
 *
 */
export function runAction(action: WrappedAction, actionsContext: ActionsContext, storeMethods: RunStoreMethods) {
  const { id, run } = action;

  if (!run) {
    storeMethods.selectParentAction(id);
    return;
  }

  const { rootContext, dynamicContext } = getActionContext(action, actionsContext);
  const result = run({ actionId: id, rootContext, dynamicContext, action });
  if (result !== true) {
    storeMethods.closePalette();
  }
}

export function getShortcutHandlersMap(
  actionsList: WrappedActionList,
  actionsContext: ActionsContext,
  storeMethods: StoreMethods
) {
  const shortcutMap: KeyBindingMap = {};

  actionsList.forEach((action) => {
    const actionHandler = (event: KeyboardEvent) => {
      const targetElem = event.target as HTMLElement;
      const shortcutsAttr = targetElem.dataset.cpKbdShortcuts;

      if (shortcutsAttr === 'disabled') {
        return;
      }

      const isAllowed = checkActionAllowed(action, actionsContext);

      if (!isAllowed) {
        return;
      }

      event.preventDefault();
      runAction(action, actionsContext, storeMethods);
    };

    const shortcut = action.shortcut;
    if (shortcut) {
      shortcutMap[shortcut] = actionHandler;
    }
  });

  return shortcutMap;
}

type ActiveParentActionIdListArg = Readonly<Array<ActionId>>;

export function getActiveParentAction(activeParentActionIdList: ActiveParentActionIdListArg) {
  const activeId = activeParentActionIdList.at(-1) || rootParentActionId;
  const isRoot = activeId === rootParentActionId;

  return {
    activeId,
    isRoot,
  };
}
