import { Component, createRenderEffect, JSXElement, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';

/** 将 Command Palette 构建到指定的 DOM 内部 */
export const CommandPalettePortal: Component<{ children?: JSXElement; mount?: HTMLElement }> = (p) => {
  let parent: HTMLElement = p.mount ?? document.body;
  const portalElem = document.createElement('div');
  portalElem.classList.add('command-palette-portal');
  createRenderEffect(() => {
    parent.appendChild(portalElem);
  });
  onCleanup(() => {
    if (portalElem) {
      portalElem.remove();
    }
  });

  return <Portal mount={portalElem}>{p.children}</Portal>;
};
