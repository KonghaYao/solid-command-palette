import { RootProps, StoreState, Action, Actions } from '../types';
import { Atom, atomization, reflect } from '@cn-ui/use';

/** 兼容四种形态的 actions 参数 */
export const TransformActionsProp = (props: RootProps): Pick<StoreState, 'actions' | 'actionsMap'> => {
  if (props.actions instanceof Array || (typeof props.actions === 'function' && props.actions() instanceof Array)) {
    const actions = atomization(props.actions as Atom<Action[]>);
    const actionsMap = reflect(() => Object.fromEntries(actions().map((i) => [i.id, i])));
    return {
      actions,
      actionsMap,
    };
  } else {
    const actionsMap = atomization(props.actions as Atom<Actions>);
    const actions = reflect(() => Object.values(actionsMap()));
    return {
      actions,
      actionsMap,
    };
  }
};
