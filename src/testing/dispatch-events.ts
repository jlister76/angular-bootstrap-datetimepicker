
export const UP_ARROW = 38;
export const DOWN_ARROW = 40;
export const RIGHT_ARROW = 39;
export const LEFT_ARROW = 37;


/** Utility to dispatch any event on a Node. */
export function dispatchEvent(node: Node | Window, event: Event): Event {
  node.dispatchEvent(event);
  return event;
}

/** Shorthand to dispatch a fake event on a specified node. */
export function dispatchFakeEvent(node: Node | Window, type: string, canBubble?: boolean): Event {
  return dispatchEvent(node, createFakeEvent(type, canBubble));
}

/** Shorthand to dispatch a keyboard event with a specified key code. */
export function dispatchKeyboardEvent(node: Node, type: string, keyCode: number, target?: Element): KeyboardEvent {
  return dispatchEvent(node, createKeyboardEvent(type, keyCode, target)) as KeyboardEvent;
}


/** Creates a fake event object with any desired event type. */
export function createFakeEvent(type: string, canBubble = true, cancelable = true) {
  const event = document.createEvent('Event');
  event.initEvent(type, canBubble, cancelable);
  return event;
}

/** Dispatches a keydown event from an element. */
export function createKeyboardEvent(type: string, keyCode: number, target?: Element, key?: string) {
  let event = document.createEvent('KeyboardEvent') as any;
  // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
  let initEventFn = (event.initKeyEvent || event.initKeyboardEvent).bind(event);
  let originalPreventDefault = event.preventDefault;

  initEventFn(type, true, true, window, 0, 0, 0, 0, 0, keyCode);

  // Webkit Browsers don't set the keyCode when calling the init function.
  // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
  Object.defineProperties(event, {
    keyCode: {get: () => keyCode},
    key: {get: () => key},
    target: {get: () => target}
  });

  // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
  event.preventDefault = function () {
    Object.defineProperty(event, 'defaultPrevented', {get: () => true});
    return originalPreventDefault.apply(this, arguments);
  };

  return event;
}
