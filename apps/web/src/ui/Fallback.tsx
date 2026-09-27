/**
 * @module ui/Fallback
 *
 * The visual fallbacks for the error boundaries.
 *
 * Two variants:
 *   - SceneFallback: shown when the 3D scene fails. Quiet,
 *     non-blocking. The UI keeps working.
 *   - AppFallback: shown when the whole app fails. Calm,
 *     with a reload button.
 *
 * No red. No alarm. The tone matches the rest of Orbit.
 */

export function SceneFallback() {
  return (
    <div className="scene-fallback">
      <span className="scene-fallback__text">
        The world could not be drawn right now.
      </span>
    </div>
  );
}

export function AppFallback() {
  return (
    <div className="app-fallback">
      <div className="app-fallback__content">
        <h1 className="app-fallback__title">Orbit</h1>
        <p className="app-fallback__message">
          Something went wrong. Your tasks are safe.
        </p>
        <button
          type="button"
          className="app-fallback__button"
          onClick={() => {
            window.location.reload();
          }}
        >
          Reload
        </button>
      </div>
    </div>
  );
}
