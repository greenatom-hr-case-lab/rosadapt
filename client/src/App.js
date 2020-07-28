import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthContext} from "./context/AuthContext"
import {useRoutes} from "./routes"
import {useAuth} from "./hooks/auth.hook"
import {Navbar} from "./components/Navbar"
import 'materialize-css'

function App() {
    const {token, login, logout, userId, userLogin, userRole, userData} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated, userRole)

    let roleRus
    switch (userRole) {
        case 'hr': roleRus = 'HR'
            break
        case 'tyro': roleRus = 'стажёр'
            break
        case 'head': roleRus = 'руководитель'
            break
        default:break
    }

    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, userLogin, isAuthenticated, userRole, userData
        }}>
            <Router>
                { isAuthenticated && <Navbar roleRus={roleRus} />}
                <main className="container">
                    { routes }
                </main>
            </Router>
        </AuthContext.Provider>
    )
}

export default App
