import { ArtSettings } from '../engine/types';
import { colorThemes, patternLabels } from '../engine/presets';

interface ControlPanelProps {
  settings: ArtSettings;
  presets: Record<string, ArtSettings>;
  onChange: (patch: Partial<ArtSettings>) => void;
  onRandomize: () => void;
  onExport: () => void;
}

const modes = Object.entries(patternLabels) as Array<[ArtSettings['mode'], string]>;
const themes = Object.entries(colorThemes) as Array<[ArtSettings['theme'], (typeof colorThemes)[ArtSettings['theme']]]>;

function ControlPanel({ settings, presets, onChange, onRandomize, onExport }: ControlPanelProps) {
  return (
    <aside className="control-panel">
      <div className="panel-heading">
        <div>
          <span>Generator</span>
          <h1>Ambient Controls</h1>
        </div>
        <button className="icon-button primary" onClick={() => onChange({ paused: !settings.paused })} type="button">
          {settings.paused ? 'Play' : 'Pause'}
        </button>
      </div>

      <label className="field">
        <span>Mode</span>
        <select value={settings.mode} onChange={(event) => onChange({ mode: event.target.value as ArtSettings['mode'] })}>
          {modes.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className="slider-grid">
        <label className="field">
          <span>Speed</span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.01"
            value={settings.speed}
            onChange={(event) => onChange({ speed: Number(event.target.value) })}
          />
        </label>
        <label className="field">
          <span>Density</span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.01"
            value={settings.density}
            onChange={(event) => onChange({ density: Number(event.target.value) })}
          />
        </label>
        <label className="field">
          <span>Size</span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.01"
            value={settings.size}
            onChange={(event) => onChange({ size: Number(event.target.value) })}
          />
        </label>
        <label className="field">
          <span>Trail</span>
          <input
            type="range"
            min="0.03"
            max="0.4"
            step="0.01"
            value={settings.trail}
            onChange={(event) => onChange({ trail: Number(event.target.value) })}
          />
        </label>
      </div>

      <label className="field">
        <span>Theme</span>
        <select value={settings.theme} onChange={(event) => onChange({ theme: event.target.value as ArtSettings['theme'] })}>
          {themes.map(([value, theme]) => (
            <option key={value} value={value}>
              {theme.label}
            </option>
          ))}
        </select>
      </label>

      <div className="swatches">
        {colorThemes[settings.theme].colors.map((color) => (
          <span key={color} style={{ backgroundColor: color, boxShadow: `0 0 18px ${color}` }} />
        ))}
      </div>

      <div className="preset-grid">
        {Object.entries(presets).map(([name, preset]) => (
          <button key={name} type="button" onClick={() => onChange(preset)}>
            {name}
          </button>
        ))}
      </div>

      <div className="panel-actions">
        <button type="button" onClick={onRandomize}>
          Randomize
        </button>
        <button type="button" onClick={onExport}>
          Export PNG
        </button>
      </div>
    </aside>
  );
}

export default ControlPanel;
