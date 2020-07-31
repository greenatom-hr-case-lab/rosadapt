import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthContext} from "./context/AuthContext"
import {useRoutes} from "./routes"
import {useAuth} from "./hooks/auth.hook"
import {Navbar} from "./components/Navbar"
import {Loader} from "./components/Loader"
import {roleRus} from "./functions/roleRus"
import 'materialize-css'

function App() {
    const {token, login, logout, userId, userLogin, userRole, userData, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated, userRole)

    if (!ready) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, userLogin, isAuthenticated, userRole, userData
        }}>
            <Router>
                { isAuthenticated && <Navbar roleRus={roleRus(userRole)} />}
                <main className="container">
                    { routes }
                </main>
            </Router>
        </AuthContext.Provider>
    )
}

export default App
