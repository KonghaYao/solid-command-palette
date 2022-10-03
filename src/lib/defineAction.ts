import { Action, PartialAction } from './types';

/**
 * @zh 规范化 action 对象
 * @en Normalizing action object
 */
export const defineAction = (partialAction: PartialAction): Action => {
  return Object.assign(
    {
      id: Math.random().toString(),
      title: null,
      subtitle: null,
      keywords: [],
      shortcut: null,
      run: () => {},
    },
    partialAction
  );
};
