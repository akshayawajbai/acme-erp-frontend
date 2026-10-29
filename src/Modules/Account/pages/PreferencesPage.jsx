import { useEffect, useState } from 'react';
import { Button, PageHeader, Select, ThemeSwitcher } from '../../../Common/components';
import {
    defaultAppearance,
    densityOptions,
    fontScaleOptions,
    sanitizeAppearance,
    shadowOptions,
    sidebarBehaviorOptions,
} from '../../../Common/theme/appearance';
import { breadcrumbsFor, pageDescriptions } from '../../../constants/navigation';
import { appRoutes } from '../../../constants/routes';
import { useTheme } from '../../../Context/ThemeContext';
import { useToast } from '../../../Context/ToastContext';

export function PreferencesPage() {
    const { mode, resolved, appearance, setAppearance, resetAppearance, previewAppearance } = useTheme();
    const { pushToast } = useToast();
    const [draft, setDraft] = useState(appearance);

    useEffect(() => {
        setDraft(appearance);
    }, [appearance]);

    function patchDraft(partial) {
        setDraft((current) => ({ ...current, ...partial }));
    }

    function setPaletteColor(index, value) {
        const next = draft.chartPalette.slice();
        next[index] = value;
        patchDraft({ chartPalette: next });
    }

    function handleLivePreview() {
        const safe = sanitizeAppearance(draft);
        setDraft(safe);
        previewAppearance(safe);
        pushToast({ message: 'Live preview applied. Save to keep these settings.', tone: 'success' });
    }

    function handleSave() {
        const safe = sanitizeAppearance(draft);
        setDraft(safe);
        setAppearance(safe);
        pushToast({ message: 'Appearance settings saved on this device.', tone: 'success' });
    }

    function handleReset() {
        resetAppearance();
        setDraft(sanitizeAppearance(defaultAppearance));
        pushToast({ message: 'Appearance reset to ACME defaults.', tone: 'success' });
    }

    return (
        <section>
            <PageHeader
                title="Preferences"
                description={pageDescriptions[appRoutes.preferences]}
                breadcrumbs={breadcrumbsFor(appRoutes.preferences)}
            />

            <div className="stack appearance-sections">
                <div className="panel preference-panel appearance-section">
                    <h2>A. Theme</h2>
                    <p className="page-description">Light and dark are saved on this device. System follows the operating system.</p>
                    <ThemeSwitcher />
                    <p className="demo-flag">
                        Current choice:
                        {' '}
                        {mode}
                        . Applied theme:
                        {' '}
                        {resolved}
                        .
                    </p>
                </div>

                <div className="panel preference-panel appearance-section">
                    <h2>B. Colors</h2>
                    <p className="page-description">Brand colors default to ACME cyan and teal. Leave optional fields blank to keep the active theme surface colors.</p>
                    <div className="appearance-grid">
                        <ColorField
                            id="primary-color"
                            label="Primary color"
                            value={draft.primaryColor}
                            onChange={(value) => patchDraft({ primaryColor: value })}
                        />
                        <ColorField
                            id="accent-color"
                            label="Accent color"
                            value={draft.accentColor}
                            onChange={(value) => patchDraft({ accentColor: value })}
                        />
                        <ColorField
                            id="background-color"
                            label="Page background"
                            value={draft.backgroundColor}
                            allowEmpty
                            onChange={(value) => patchDraft({ backgroundColor: value })}
                        />
                        <ColorField
                            id="surface-color"
                            label="Content surface"
                            value={draft.surfaceColor}
                            allowEmpty
                            onChange={(value) => patchDraft({ surfaceColor: value })}
                        />
                        <ColorField
                            id="sidebar-bg"
                            label="Sidebar background"
                            value={draft.sidebarBackground}
                            allowEmpty
                            onChange={(value) => patchDraft({ sidebarBackground: value })}
                        />
                        <ColorField
                            id="sidebar-text"
                            label="Sidebar text"
                            value={draft.sidebarText}
                            allowEmpty
                            onChange={(value) => patchDraft({ sidebarText: value })}
                        />
                        <ColorField
                            id="sidebar-active"
                            label="Sidebar active"
                            value={draft.sidebarActive}
                            allowEmpty
                            onChange={(value) => patchDraft({ sidebarActive: value })}
                        />
                        <ColorField
                            id="sidebar-hover"
                            label="Sidebar hover"
                            value={draft.sidebarHover}
                            allowEmpty
                            onChange={(value) => patchDraft({ sidebarHover: value })}
                        />
                    </div>
                    <div>
                        <h3>Chart palette</h3>
                        <div className="palette-row">
                            {draft.chartPalette.map((color, index) => (
                                <label key={`chart-${index}`} className="palette-swatch" title={`Chart color ${index + 1}`}>
                                    <span className="sr-only">{`Chart color ${index + 1}`}</span>
                                    <input
                                        type="color"
                                        value={color}
                                        onChange={(event) => setPaletteColor(index, event.target.value)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="panel preference-panel appearance-section">
                    <h2>C. Card styling</h2>
                    <div className="appearance-grid">
                        <label className="field">
                            <span>Show card borders</span>
                            <input
                                type="checkbox"
                                checked={draft.cardBorderVisible}
                                onChange={(event) => patchDraft({ cardBorderVisible: event.target.checked })}
                            />
                        </label>
                        <ColorField
                            id="card-border-color"
                            label="Card border color"
                            value={draft.cardBorderColor}
                            allowEmpty
                            onChange={(value) => patchDraft({ cardBorderColor: value })}
                        />
                        <div className="field">
                            <label htmlFor="card-radius">Corner radius ({draft.cardRadius}px)</label>
                            <input
                                id="card-radius"
                                className="control"
                                type="range"
                                min="0"
                                max="24"
                                value={draft.cardRadius}
                                onChange={(event) => patchDraft({ cardRadius: Number(event.target.value) })}
                            />
                        </div>
                        <Select
                            id="card-shadow"
                            label="Shadow intensity"
                            hidePlaceholder
                            value={draft.cardShadow}
                            options={shadowOptions.map((item) => ({ value: item.id, label: item.label }))}
                            onChange={(value) => patchDraft({ cardShadow: value })}
                        />
                        <div className="field">
                            <label htmlFor="card-spacing">Card spacing ({draft.cardSpacing}px)</label>
                            <input
                                id="card-spacing"
                                className="control"
                                type="range"
                                min="8"
                                max="32"
                                value={draft.cardSpacing}
                                onChange={(event) => patchDraft({ cardSpacing: Number(event.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="panel preference-panel appearance-section">
                    <h2>D. Layout</h2>
                    <div className="appearance-grid">
                        <Select
                            id="density"
                            label="Content density"
                            hidePlaceholder
                            value={draft.density}
                            options={densityOptions.map((item) => ({ value: item.id, label: item.label }))}
                            onChange={(value) => patchDraft({ density: value })}
                        />
                        <Select
                            id="sidebar-behavior"
                            label="Sidebar behavior"
                            hidePlaceholder
                            value={draft.sidebarBehavior}
                            options={sidebarBehaviorOptions.map((item) => ({ value: item.id, label: item.label }))}
                            onChange={(value) => patchDraft({ sidebarBehavior: value })}
                        />
                        <Select
                            id="font-scale"
                            label="Typography size"
                            hidePlaceholder
                            value={draft.fontScale}
                            options={fontScaleOptions.map((item) => ({ value: item.id, label: item.label }))}
                            onChange={(value) => patchDraft({ fontScale: value })}
                        />
                    </div>
                </div>

                <div className="panel preference-panel appearance-section">
                    <h2>E. Actions</h2>
                    <p className="page-description">Preview applies tokens immediately. Save persists them. Reset restores ACME defaults. Appearance never changes financial calculations, permissions, or API behavior.</p>
                    <div className="appearance-actions">
                        <Button variant="outline" onClick={handleLivePreview}>Live preview</Button>
                        <Button variant="primary" onClick={handleSave}>Save settings</Button>
                        <Button variant="secondary" onClick={handleReset}>Reset to ACME defaults</Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ColorField({ id, label, value, onChange, allowEmpty = false }) {
    const hex = value || '#000000';
    return (
        <div className="color-field field">
            <label htmlFor={id}>{label}</label>
            <div className="color-field__row">
                <input
                    id={id}
                    type="color"
                    value={hex}
                    onChange={(event) => onChange(event.target.value)}
                    aria-label={label}
                />
                <input
                    id={`${id}-text`}
                    className="control"
                    type="text"
                    value={value}
                    placeholder={allowEmpty ? 'Theme default' : '#000000'}
                    onChange={(event) => onChange(event.target.value)}
                    aria-label={`${label} hex value`}
                />
            </div>
            {allowEmpty ? (
                <button type="button" className="text-button" onClick={() => onChange('')}>
                    Use theme default
                </button>
            ) : null}
        </div>
    );
}
