/**
 * @module ui/NetworkIndicator
 *
 * A small corner overlay that appears only when the browser is
 * offline. It says "Offline" and nothing more.
 *
 * Per PRD F-903 and UI/UX §27: do not use an intrusive banner.
 * Use a subtle environmental signal.
 *
 * Source: System Architecture §18 (Offline Guarantee).
 */

import { useNetworkStore } from '@/state/network';

export function NetworkIndicator() {
  const online = useNetworkStore((s) => s.online);

  if (online) return null;

  return (
    <div className="network-indicator" role="status" aria-live="polite">
      <span className="network-indicator__dot" />
      <span className="network-indicator__text">Offline</span>
    </div>
  );
}
