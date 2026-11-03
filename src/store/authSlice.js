import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../services/dataProvider';
import { clearSession, readSession, writeSession } from '../utilities/session';

function restoredSession() {
    if (typeof sessionStorage === 'undefined') {
        return null;
    }
    return readSession();
}

const restored = restoredSession();

const initialState = {
    status: restored ? 'authenticated' : 'idle',
    session: restored,
    error: '',
};

function failureMessage(action) {
    const message =
        action.error && typeof action.error.message === 'string' ? action.error.message.trim() : '';
    return message || 'Something went wrong. Please try again.';
}

export const login = createAsyncThunk('auth/login', async (request) => {
    const nextSession = await authService.login(request);
    writeSession(nextSession);
    return nextSession;
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout();
    clearSession();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authRequestStarted(state) {
            state.status = 'loading';
            state.error = '';
        },
        authSessionSet(state, action) {
            state.status = 'authenticated';
            state.session = action.payload;
            state.error = '';
        },
        authRequestFailed(state, action) {
            state.status = 'failed';
            state.error =
                typeof action.payload === 'string' && action.payload.trim()
                    ? action.payload.trim()
                    : 'Something went wrong. Please try again.';
        },
        authSessionCleared(state) {
            state.status = 'idle';
            state.session = null;
            state.error = '';
        },
        authErrorCleared(state) {
            state.error = '';
        },
    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.status = 'loading';
                state.error = '';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'authenticated';
                state.session = action.payload;
                state.error = '';
            })
            .addCase(login.rejected, (state, action) => {
                state.error = failureMessage(action);
                if (state.session) {
                    state.status = 'authenticated';
                    return;
                }
                state.status = 'failed';
                state.session = null;
            })
            .addCase(logout.pending, (state) => {
                state.status = 'loading';
                state.error = '';
            })
            .addCase(logout.fulfilled, (state) => {
                state.status = 'idle';
                state.session = null;
                state.error = '';
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = failureMessage(action);
                state.status = state.session ? 'authenticated' : 'failed';
            });
    },
});

export const {
    authRequestStarted,
    authSessionSet,
    authRequestFailed,
    authSessionCleared,
    authErrorCleared,
} = authSlice.actions;

export function selectAuthState(state) {
    return state.auth;
}

export default authSlice.reducer;
