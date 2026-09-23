/**
 * @module input
 *
 * The interaction input layer. Unifies mouse, touch, keyboard, and
 * future input methods into a single stream of semantic intents.
 */

export { InteractionHandler } from './InteractionHandler';
export { useDrag } from './useDrag';
export { useKeyboardNavigation } from './useKeyboardNavigation';
export { dispatchIntent, useIntents } from './useIntent';
export type { InteractionIntent, IntentListener } from './intents';
