import {useState, useCallback, useEffect} from 'react'

const storageName = 'userDataStorage'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [ready, setReady] = useState(false)
    const [userId, setUserId] = useState(null)
    const [userLogin, setUserLogin] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [userData, setUserData] = useState(null)

    const login = useCallback( (jwtToken, id, loginName, roleName, data) => {
        setToken(jwtToken)
        setUserId(id)
        setUserLogin(loginName)
        setUserRole(roleName)
        setUserData(data)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, userLogin: loginName, userRole: roleName, userData: data, token: jwtToken
        }))
    }, [])

    const logout = useCallback( () => {
        setToken(null)
        setUserId(null)
        setUserLogin(null)
        setUserRole(null)
        setUserData(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId, data.userLogin, data.userRole, data.userData)
        }
        setReady(true)
    }, [login])

    return { login, logout, token, userId, userLogin, userRole, userData, ready }
}