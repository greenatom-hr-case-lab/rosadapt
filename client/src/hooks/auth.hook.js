import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userLogin, setUserLogin] = useState(null)

    const login = useCallback( (jwtToken, id, loginName) => {
        setToken(jwtToken)
        setUserId(id)
        setUserLogin(loginName)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, userLogin: loginName, token: jwtToken
        }))
    }, [])

    const logout = useCallback( () => {
        setToken(null)
        setUserId(null)
        setUserLogin(null)
        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId, data.userLogin)
        }
    }, [login])

    return { login, logout, token, userId, userLogin }
}