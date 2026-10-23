import { authApiRepository } from '../Modules/Auth/services/authApiRepository';
import { authMockRepository } from '../Modules/Auth/services/authMockRepository';
import { officeApiRepository } from '../Modules/Auth/services/officeApiRepository';
import { officeMockRepository } from '../Modules/Auth/services/officeMockRepository';
import { dashboardApiRepository } from '../Modules/Dashboard/services/dashboardApiRepository';
import { dashboardMockRepository } from '../Modules/Dashboard/services/dashboardMockRepository';
import { ledgerApiRepository } from '../Modules/Finance/Ledger/services/ledgerApiRepository';
import { ledgerMockRepository } from '../Modules/Finance/Ledger/services/ledgerMockRepository';
import { apiConfig } from '../Api_Config/apiConfig';
function selectRepository(mockRepository, apiRepository) {
    return apiConfig.dataMode === 'api' ? apiRepository : mockRepository;
}
export const officeService = selectRepository(officeMockRepository, officeApiRepository);
export const authService = selectRepository(authMockRepository, authApiRepository);
export const dashboardService = selectRepository(dashboardMockRepository, dashboardApiRepository);
export const ledgerService = selectRepository(ledgerMockRepository, ledgerApiRepository);
