import { themeModes } from '../theme/applyTheme';
import { useTheme } from '../../Context/ThemeContext';
import { MonitorIcon, MoonIcon, SunIcon } from './Icons';

const icons = {
    light: SunIcon,
    dark: MoonIcon,
    system: MonitorIcon,
};

export function ThemeToggle() {
    const { resolved, setMode } = useTheme();
    const isDark = resolved === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    const Icon = isDark ? MoonIcon : SunIcon;

    return (
        <button type="button" className="icon-button theme-toggle" aria-label={label} title={label} onClick={() => setMode(isDark ? 'light' : 'dark')}>
            <Icon />
        </button>
    );
}

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
