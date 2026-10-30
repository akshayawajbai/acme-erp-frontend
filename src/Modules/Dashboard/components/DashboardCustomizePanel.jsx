import { Button, Select } from '../../../Common/components';
import { dashboardWidgetRegistry, getWidgetMeta, widgetSizeOptions } from '../dashboardLayout';

export function DashboardCustomizePanel({ layout, onChange, onReset, onDone }) {
    function toggleVisible(id) {
        onChange(layout.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)));
    }

    function changeSize(id, size) {
        onChange(layout.map((item) => (item.id === id ? { ...item, size } : item)));
    }

    function move(id, direction) {
        const index = layout.findIndex((item) => item.id === id);
        if (index < 0) {
            return;
        }
        const target = index + direction;
        if (target < 0 || target >= layout.length) {
            return;
        }
        const next = layout.slice();
        const [row] = next.splice(index, 1);
        next.splice(target, 0, row);
        onChange(next);
    }

    return (
        <div className="panel customize-panel">
            <div className="dashboard-toolbar">
                <div>
                    <h2>Customize dashboard</h2>
                    <p className="page-description">Show, hide, resize, and reorder widgets. Layout is saved on this device.</p>
                </div>
                <div className="appearance-actions">
                    <Button variant="outline" size="small" onClick={onReset}>Reset layout</Button>
                    <Button variant="primary" size="small" onClick={onDone}>Done</Button>
                </div>
            </div>
            <ul className="customize-list">
                {layout.map((item, index) => {
                    const meta = getWidgetMeta(item.id) || dashboardWidgetRegistry.find((widget) => widget.id === item.id);
                    return (
                        <li key={item.id} className="customize-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={item.visible}
                                    onChange={() => toggleVisible(item.id)}
                                />
                                <span className="sr-only">Show {meta?.label || item.id}</span>
                            </label>
                            <div>
                                <strong>{meta?.label || item.id}</strong>
                                <div className="appearance-actions customize-item-actions">
                                    <Button variant="outline" size="small" disabled={index === 0} onClick={() => move(item.id, -1)}>Up</Button>
                                    <Button variant="outline" size="small" disabled={index === layout.length - 1} onClick={() => move(item.id, 1)}>Down</Button>
                                </div>
                            </div>
                            <Select
                                id={`widget-size-${item.id}`}
                                label="Size"
                                hidePlaceholder
                                value={item.size}
                                options={widgetSizeOptions.map((option) => ({ value: option.id, label: option.label }))}
                                onChange={(value) => changeSize(item.id, value)}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
