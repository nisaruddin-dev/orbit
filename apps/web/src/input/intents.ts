/**
 * @module input/intents
 *
 * Semantic interaction intents. Every input method (mouse, touch,
 * keyboard, future automation) produces one of these. No component
 * ever reads raw pointer or key events directly.
 *
 * An intent is a *statement of what the user wants*, not a record
 * of what they physically did. "Select the task with ID X" is an
 * intent. "The user clicked at pixel (450, 320)" is not.
 */

/**
 * The full vocabulary of user intents in Orbit.
 *
 * This is intentionally small. Every future interaction must be
 * expressible as one of these. If it isn't, add a new intent —
 * don't bypass the system.
 */
export type InteractionIntent =
  | { type: 'SELECT_NODE'; nodeId: string }
  | { type: 'DESELECT_NODE' }
  | { type: 'FOCUS_NODE'; nodeId: string }
  | { type: 'HOVER_NODE'; nodeId: string }
  | { type: 'UNHOVER_NODE' }
  | { type: 'BEGIN_DRAG'; nodeId: string }
  | { type: 'UPDATE_DRAG'; worldPosition: [number, number, number] }
  | { type: 'END_DRAG' }
  | { type: 'PROXIMITY_CHANGED'; nodeId: string; scalar: number }
  | { type: 'COMPLETE_NODE'; nodeId: string }
  | { type: 'ARCHIVE_NODE'; nodeId: string }
  | { type: 'OPEN_EDITOR'; nodeId: string }
  | { type: 'CHANGE_VIEW'; view: 'orbit' | 'focus' | 'timeline' | 'aurora' }
  | { type: 'UNDO' }
  | { type: 'CANCEL' };

/**
 * A listener for intents. Components and hooks subscribe to
 * receive intents as they are produced.
 */
export type IntentListener = (intent: InteractionIntent) => void;
