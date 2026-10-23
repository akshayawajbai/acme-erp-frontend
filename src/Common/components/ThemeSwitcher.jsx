import { themeModes } from '../theme/applyTheme';
import { useTheme } from '../../Context/ThemeContext';
import { MonitorIcon, MoonIcon, SunIcon } from './Icons';

const icons = {
    light: SunIcon,
    dark: MoonIcon,
    system: MonitorIcon,
};

export function ThemeSwitcher({ labelled = true }) {
    const { mode, setMode } = useTheme();
    return (
        <div className="theme-switch" role="radiogroup" aria-label="Color theme">
            {themeModes.map((option) => {
                const Icon = icons[option.id];
                const selected = mode === option.id;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={selected ? 'theme-option is-selected' : 'theme-option'}
                        onClick={() => setMode(option.id)}
                    >
                        <Icon />
                        {labelled ? <span>{option.label}</span> : <span className="sr-only">{option.label}</span>}
                    </button>
                );
            })}
        </div>
    );
}
