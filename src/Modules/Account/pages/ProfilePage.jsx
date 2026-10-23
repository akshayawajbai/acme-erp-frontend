import { PageHeader } from '../../../Common/components';
import { breadcrumbsFor, pageDescriptions } from '../../../constants/navigation';
import { appRoutes } from '../../../constants/routes';
import { useAuth } from '../../../Context/AuthContext';

export function ProfilePage() {
    const { session } = useAuth();
    return (
        <section>
            <PageHeader
                title="Profile"
                description={pageDescriptions[appRoutes.profile]}
                breadcrumbs={breadcrumbsFor(appRoutes.profile)}
            />
            <div className="panel profile-panel">
                <p className="profile-kicker">Demonstration user</p>
                <h2>{session?.displayName}</h2>
                <dl className="detail-list">
                    <div>
                        <dt>Head office</dt>
                        <dd>{session?.headOfficeName}</dd>
                    </div>
                    <div>
                        <dt>Branch office</dt>
                        <dd>{session?.branchOfficeName}</dd>
                    </div>
                </dl>
                <p className="demo-flag">This session is stored in the browser for the prototype. It is not a secured user account.</p>
            </div>
        </section>
    );
}
