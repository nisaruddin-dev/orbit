/**
 * Orbit — Root application component.
 *
 * For now, this renders a placeholder. The actual 3D scene will be
 * added in Sub-step 5.3.
 */

import { ENVIRONMENT, ACCENT } from '@/design';
import { APP_VERSION, APP_PHASE } from '@/lib';

export default function App() {
  return (
    <div className="app">
      <h1>Orbit</h1>
      <p>A personal immersive 3D to-do environment.</p>
      <p className="status">
        Version {APP_VERSION} · Phase: {APP_PHASE}
      </p>
      <p className="status" style={{ color: ACCENT.active, fontSize: '0.75rem' }}>
        Tokens loaded: {Object.keys(ENVIRONMENT).length} environment colors,{' '}
        {Object.keys(ACCENT).length} accents.
      </p>
    </div>
  );
}
