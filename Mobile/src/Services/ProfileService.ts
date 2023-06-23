import create from 'zustand'

type Profile = {
    changePassword: Boolean,
    isLogging: Boolean,
    user: any,
    errMsg: string,
    isDispatching: Boolean,
    notifications: Array<any>,
    meta: any,
    username: string,
    roles: any,
    auth: Boolean,
    tablemeta: any,
    Language: string,
    resetpasswordStatus: Boolean
}

type ProfileStore = {
    Profile: Profile;
    LogIn: () => Promise<void>,
    Register: () => Promise<void>,
    GetActiveUser: () => Promise<void>,
    GetUserMeta: () => Promise<void>,
    GetUserRoles: () => Promise<void>,
    GetTableMeta: () => Promise<void>,
    SaveTableMeta: () => Promise<void>,
}