import { apiConfig, requireEndpoint } from '../../../Api_Config/apiConfig';
import { httpClient } from '../../../Api_Config/httpClient';
import {
    contractError,
    isRecord,
    readNumber,
    readString,
} from '../../../utilities/guards';

function readOptionalString(record, key) {
    const value = record[key];
    return typeof value === 'string' ? value : null;
}

function readBoolean(record, key) {
    const value = record[key];
    return typeof value === 'boolean' ? value : null;
}

function displayNameFromUser(user) {
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    if (fullName) {
        return fullName;
    }
    return user.userName;
}

function mapLoginResponse(payload, request) {
    if (!isRecord(payload)) {
        throw contractError('Login');
    }

    const accessToken = readString(payload, 'accessToken');
    const tokenType = readString(payload, 'tokenType');
    const expiresInMinutes = readNumber(payload, 'expiresInMinutes');
    const topLevelPasswordChange = readBoolean(payload, 'passwordChangeRequired');

    if (!accessToken || !tokenType || expiresInMinutes === null || expiresInMinutes <= 0) {
        throw contractError('Login');
    }
    if (topLevelPasswordChange === null) {
        throw contractError('Login');
    }

    if (!isRecord(payload.user)) {
        throw contractError('Login');
    }

    const user = payload.user;
    const userId = readNumber(user, 'userId');
    const userName = readString(user, 'userName');
    const firstName = readOptionalString(user, 'firstName');
    const lastName = readOptionalString(user, 'lastName');
    const roleId = readNumber(user, 'roleId');
    const userRole = readOptionalString(user, 'userRole');
    const userType = readNumber(user, 'userType');
    const headOfficeCode = readOptionalString(user, 'headOfficeCode');
    const branchCode = readOptionalString(user, 'branchCode');
    const branchOfficeName = readOptionalString(user, 'branchOfficeName');
    const passwordStatus = readNumber(user, 'passwordStatus');
    const userPasswordChange = readBoolean(user, 'passwordChangeRequired');

    if (
        userId === null ||
        !userName ||
        firstName === null ||
        lastName === null ||
        roleId === null ||
        userRole === null ||
        userType === null ||
        headOfficeCode === null ||
        branchCode === null ||
        branchOfficeName === null ||
        passwordStatus === null ||
        userPasswordChange === null
    ) {
        throw contractError('Login');
    }

    const passwordChangeRequired = topLevelPasswordChange || userPasswordChange;
    const resolvedHeadOfficeCode = headOfficeCode.trim() || request.headOfficeCode.trim();
    const resolvedBranchName = branchOfficeName.trim() || branchCode.trim() || '—';
    const displayName = displayNameFromUser({ firstName, lastName, userName });

    if (!resolvedHeadOfficeCode || !displayName) {
        throw contractError('Login');
    }

    return {
        accessToken,
        tokenType,
        expiresInMinutes,
        loggedInAt: Date.now(),
        passwordChangeRequired,
        userId,
        userName,
        firstName,
        lastName,
        roleId,
        userRole,
        userType,
        headOfficeCode,
        branchCode,
        passwordStatus,
        headOfficeId: resolvedHeadOfficeCode,
        headOfficeName: resolvedHeadOfficeCode,
        branchOfficeId: branchCode,
        branchOfficeName: resolvedBranchName,
        displayName,
    };
}

export const authApiRepository = {
    async login(request) {
        const path = requireEndpoint(apiConfig.endpoints.login, 'Login');
        const headOfficeCode =
            typeof request.headOfficeCode === 'string' ? request.headOfficeCode.trim() : '';
        const userName = typeof request.userName === 'string' ? request.userName.trim() : '';
        const password = typeof request.password === 'string' ? request.password : '';

        if (!headOfficeCode) {
            throw new Error('Enter a head office code.');
        }
        if (!userName) {
            throw new Error('Enter a username.');
        }
        if (!password.trim()) {
            throw new Error('Enter a password.');
        }

        const payload = await httpClient.post(path, {
            headOfficeCode,
            userName,
            password,
        });

        return mapLoginResponse(payload, { headOfficeCode, userName });
    },
    async logout() {
        // No logout API contract has been supplied. Clear the local session only.
        if (!apiConfig.endpoints.logout) {
            return;
        }
        const path = requireEndpoint(apiConfig.endpoints.logout, 'Logout');
        await httpClient.post(path, {});
    },
};
