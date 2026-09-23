/**
 * @module input
 *
 * The interaction input layer. Unifies mouse, touch, keyboard, and
 * future input methods into a single stream of semantic intents.
 *
 * Components that produce intents use `dispatchIntent`.
 * Components that consume intents use `useIntents`.
 */

export { InteractionHandler } from './InteractionHandler';
export { dispatchIntent, useIntents } from './useIntent';
export type { InteractionIntent, IntentListener } from './intents';
