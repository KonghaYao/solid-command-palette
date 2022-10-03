import { ActionId, WrappedAction, WrappedActionList } from '../../types';

type ActiveItemId = null | ActionId;
export type ResultItemElem = undefined | HTMLLIElement;

export interface ResultItemProps {
  action: WrappedAction;
  activeItemId: ActiveItemId;
  onActionItemSelect: (action: WrappedAction) => void;
  onActionItemHover: (action: WrappedAction) => void;
}

export interface PanelResultProps {
  activeItemId: ActiveItemId;
  resultsList: WrappedActionList;
  resultListId: string;
  searchLabelId: string;
  onActionItemSelect: (action: WrappedAction) => void;
  onActionItemHover: (action: WrappedAction) => void;
}
