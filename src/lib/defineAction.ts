import { Action, PartialAction } from './types';

/**
 * @zh 规范化 action 对象
 * @en Normalizing action object
 */
export const defineAction = (partialAction: PartialAction): Action => {
  // const id = partialAction.id || Math.random().toString();
  // const parentActionId = partialAction.parentActionId || null;
  // const title = partialAction.title;
  // const subtitle = partialAction.subtitle || null;
  // const keywords = partialAction.keywords || [];
  // const shortcut = partialAction.shortcut || null;
  // const run = partialAction.run;

  // const normalizedAction = {
  //   id,
  //   parentActionId,
  //   title,
  //   subtitle,
  //   keywords,
  //   shortcut,
  //   cond: partialAction.cond,
  //   run,
  // };

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
