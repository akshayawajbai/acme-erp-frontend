import { PageHeader, ThemeSwitcher } from '../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../constants/navigation';
import { appRoutes } from '../../../constants/routes';
import { useTheme } from '../../../Context/ThemeContext';

export function PreferencesPage() {
    const { mode, resolved } = useTheme();
    return (
        <section>
            <PageHeader
                title="Preferences"
                description={pageDescriptions[appRoutes.preferences]}
                breadcrumbs={breadcrumbsFor(appRoutes.preferences)}
            />
            <div className="panel preference-panel">
                <h2>Appearance</h2>
                <p className="page-description">Light and dark are saved on this device. System follows the operating system and updates when that preference changes.</p>
                <ThemeSwitcher />
                <p className="demo-flag">Current choice: {mode}. Applied theme: {resolved}.</p>
            </div>
        </section>
    );
}
