import {createContext} from 'react'

function noop() {}
let arr = []

export const AuthContext = createContext({
    token: null,
    userId: null,
    userLogin: null,
    userRole: null,
    userData: arr,
    login: noop(),
    logout: noop(),
    isAuthenticated: false
})