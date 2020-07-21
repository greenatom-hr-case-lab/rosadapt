import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {ProfilePage} from "./pages/ProfilePage";
import {CreatePage} from "./pages/CreatePage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = (isAuthenticated, userRole) => {
    if (isAuthenticated){
        if (userRole === 'tyro'){
            return(
                <Switch>
                    <Route path="/profile" exact>
                        <ProfilePage />
                    </Route>
                    <Redirect to="/profile" />
                </Switch>
            )
        } else {
            return(
                <Switch>
                    <Route path="/create" exact>
                        <CreatePage />
                    </Route>
                    <Route path="/profile" exact>
                        <ProfilePage />
                    </Route>
                    <Redirect to="/profile" />
                </Switch>
            )
        }
    }

    return (
        <Switch>
            <Route path="/" exact>
                <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}