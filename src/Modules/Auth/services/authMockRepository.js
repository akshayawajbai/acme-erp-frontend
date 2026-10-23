import { branchOffices, headOffices } from '../mocks/offices';
import { delay } from '../../../utilities/delay';
/**
 * Demonstration sign-in. Any non-empty password is accepted.
 * The password is checked and then discarded. It is never stored.
 */
export const authMockRepository = {
    async login(request) {
        await delay(600);
        const password = request.password.trim();
        if (!password) {
            throw new Error('Enter a password.');
        }
        const headOffice = headOffices.find((office) => office.id === request.headOfficeId);
        const branchOffice = branchOffices.find((office) => office.id === request.branchOfficeId && office.headOfficeId === request.headOfficeId);
        if (!headOffice || !branchOffice) {
            throw new Error('Select a valid head office and branch office.');
        }
        return {
            headOfficeId: headOffice.id,
            headOfficeName: headOffice.name,
            branchOfficeId: branchOffice.id,
            branchOfficeName: branchOffice.name,
            displayName: 'Demo User',
        };
    },
    async logout() {
        await delay(150);
    },
};
