import { branchOffices, headOffices } from '../mocks/offices';
import { delay } from '../../../utilities/delay';
export const officeMockRepository = {
    async getHeadOffices() {
        await delay(250);
        return headOffices.map((office) => ({ ...office }));
    },
    async getBranchOffices(headOfficeId) {
        await delay(200);
        return branchOffices
            .filter((office) => office.headOfficeId === headOfficeId)
            .map((office) => ({ ...office }));
    },
};
