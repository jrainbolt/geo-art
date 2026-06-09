import { useCallback, useEffect, useMemo, useState } from 'react';
import ArtCanvas from './components/ArtCanvas';
import ControlPanel from './components/ControlPanel';
import { ArtSettings } from './engine/types';
import { colorThemes, defaultSettings, presets } from './engine/presets';

const STORAGE_KEY = 'ambient-geometric-art-engine-settings';

const loadSettings = (): ArtSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const randomSetting = (min = 0.12, max = 0.96) => Number((min + Math.random() * (max - min)).toFixed(2));

function App() {
  const [settings, setSettings] = useState<ArtSettings>(loadSettings);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const theme = useMemo(() => colorThemes[settings.theme], [settings.theme]);

  const updateSettings = useCallback((patch: Partial<ArtSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  }, []);

  const randomize = useCallback(() => {
    const modes = ['orbitingCircles', 'rotatingPolygons', 'particleConstellation', 'waveGrid', 'fractalTree'] as const;
    const themes = Object.keys(colorThemes) as Array<keyof typeof colorThemes>;
    setSettings((current) => ({
      ...current,
      mode: modes[Math.floor(Math.random() * modes.length)],
      speed: randomSetting(0.18, 1),
      density: randomSetting(0.22, 0.95),
      size: randomSetting(0.18, 0.9),
      trail: randomSetting(0.05, 0.36),
      theme: themes[Math.floor(Math.random() * themes.length)],
      paused: false,
    }));
  }, []);

  const exportPng = useCallback(() => {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ambient-geometric-art-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [canvas]);

  return (
    <main className="app" style={{ backgroundColor: theme.background }}>
      <ArtCanvas settings={settings} theme={theme} onCanvasReady={setCanvas} />
      <div className="brand">
        <span>Ambient</span>
        <strong>Geometric Art Engine</strong>
      </div>
      <ControlPanel
        settings={settings}
        presets={presets}
        onChange={updateSettings}
        onRandomize={randomize}
        onExport={exportPng}
      />
    </main>
  );
}

export default App;
