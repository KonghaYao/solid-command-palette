import { PaletteRoot } from '@cn-ui/command-palette';

<PaletteRoot
  /* map of all actions */
  actions={{
    [myAction.id]: myAction,
    /* ... other actions ... */
  }}
  /* share App's signals and methods with actions */
  actionsContext={{
    count,
    incrementCount,
    deleteMessage,
  }}
  /* Custom components to render in palette */
  components={{
    /* content for action in search result list */
    ResultContent,
  }}
/>;
