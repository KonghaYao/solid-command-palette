import { Atom } from '@cn-ui/use';
import { Component, JSXElement } from 'solid-js';
import { DeepReadonly, Store } from 'solid-js/store';

export type ActionId = string;
export type ParentActionId = null | ActionId;
export type ActionShortcut = string;

export type ActionContext = Record<string, unknown>;

export type DynamicContextMap = Record<ActionId, ActionContext>;

export interface ActionsContext {
  root: ActionContext;
  dynamic: DynamicContextMap;
}

export interface RunArgs {
  actionId: ActionId;
  rootContext: ActionContext;
  dynamicContext: ActionContext;
}

export interface Action {
  id: ActionId;
  parentActionId: ParentActionId;
  title: string;
  subtitle: null | string;
  keywords: Array<string>;
  /**
   * Keyboard Shortcut like `$mod+e`, `Shift+p`.
   */
  shortcut: null | ActionShortcut;
  /**
   * Enable the action conditionally.
   */
  cond?: (args: RunArgs) => boolean;
  /**
   * @zh 当返回 true 时，将不会关闭面板
   */
  run?: (args: RunArgs) => void | true;
}

export type PartialAction = Partial<Action> & {
  id: ActionId;
  title: Action['title'];
};

export type Actions = Record<ActionId, Action>;
export type ActionsList = Array<Action>;
export type WrappedAction = DeepReadonly<Action>;
export type WrappedActionList = Array<WrappedAction>;

export interface ResultContentProps {
  action: WrappedAction;
  isActive: boolean;
  icon?: Component<{ action: Action }>;
}

export interface Components {
  ResultContent?: Component<ResultContentProps>;
  ResultIcon?: Component<{ action: Action }>;
  Main?: Component;
}

export interface RootProps {
  actions: Atom<Action[]> | Atom<Actions> | Action[] | Actions;
  actionsContext: ActionContext;
  components?: Components;
  visibility?: boolean | Atom<boolean>;
  searchText?: string | Atom<string>;
  filters?: ActionFilter[] | Atom<ActionFilter[]>;
  children?: JSXElement;
}
import Fuse from 'fuse.js';
export type ActionFilter = (action: Action) => boolean;
export interface StoreState {
  activeParentActionIdList: Array<ActionId>;
  actionsContext: ActionsContext;
  components?: Components;
  fuseOptions?: Fuse.IFuseOptions<Action>;
}
export type ReactiveStore = {
  filters: Atom<ActionFilter[]>;
  searchText: Atom<string>;
  visibility: Atom<boolean>;
  actions: Atom<Action[]>;
  resultsList: Atom<Action[]>;
  actionsMap: Atom<Actions>;
};
export type StoreStateWrapped = Store<StoreState>;

export interface StoreMethods {
  setActionsContext: (actionId: ActionId, newData: ActionContext) => void;
  resetActionsContext: (actionId: ActionId) => void;
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
  selectParentAction: (parentActionId: ActionId) => void;
  revertParentAction: () => void;
  resetParentAction: () => void;
}

export type StoreContext = [StoreStateWrapped, StoreMethods, ReactiveStore];

type CreateSyncActionsContextCallback = () => ActionContext;

export type CreateSyncActionsContext = (actionId: ActionId, callback: CreateSyncActionsContextCallback) => void;
