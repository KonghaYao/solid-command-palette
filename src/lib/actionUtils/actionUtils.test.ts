import { describe, test, expect } from 'vitest';
import { defineAction } from '../defineAction';
import { checkActionAllowed } from './actionUtils';

describe('Test KbdShortcut on Mac', () => {
  const baseAction = {
    id: 'test-action',
    title: 'Test Action',
    run: () => {
      console.log('test ran');
    },
  };

  test('should allow action if no condition defined', () => {
    const action = defineAction(baseAction);

    const actionsContext = {
      root: {},
      dynamic: {},
    };

    const isAllowed = checkActionAllowed(action, actionsContext);
    expect(isAllowed).toBe(true);
  });

  test('should allow action based on root context', () => {
    const action = defineAction({
      ...baseAction,
      cond: ({ rootContext }) => {
        return rootContext.profile === 'work';
      },
    });

    const failingActionsContext = {
      root: {
        profile: 'personal',
      },
      dynamic: {},
    };
    expect(checkActionAllowed(action, failingActionsContext), 'action is not allowed').toBe(false);

    const passingActionsContext = {
      root: {
        profile: 'work',
      },
      dynamic: {},
    };
    expect(checkActionAllowed(action, passingActionsContext), 'action is allowed').toBe(true);
  });

  test('should allow action based on dynamic context', () => {
    const action = defineAction({
      ...baseAction,
      cond: ({ dynamicContext }) => {
        return dynamicContext.isActive === true;
      },
    });

    const failingActionsContext = {
      root: {},
      dynamic: {
        'test-action': {
          isActive: false,
        },
        'other-action': {
          isActive: true,
        },
      },
    };
    expect(checkActionAllowed(action, failingActionsContext), 'action is not allowed').toBe(false);

    const passingActionsContext = {
      root: {},
      dynamic: {
        'test-action': {
          isActive: true,
        },
        'other-action': {
          isActive: false,
        },
      },
    };
    expect(checkActionAllowed(action, passingActionsContext), 'action is allowed').toBe(true);
  });
});
