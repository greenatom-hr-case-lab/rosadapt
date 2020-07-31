import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {TyroPage} from "./pages/tyro/TyroPage";
import {HrPage} from "./pages/hr/HrPage";
import {AuthPage} from "./pages/AuthPage";
import {CreateUserPage} from "./pages/hr/CreateUserPage";
import {CreatePlanPage} from "./pages/hr/CreatePlanPage";
import {HrShowPage} from "./pages/hr/HrShowPage";
import {HeadPage} from "./pages/head/HeadPage";
import {PlanPage} from "./pages/PlanPage";

export const useRoutes = (isAuthenticated, userRole) => {
    if (isAuthenticated){
        switch (userRole) {
            case 'tyro':
                return(
                    <Switch>
                        <Route path="/main" exact>
                            <TyroPage />
                        </Route>
                        <Redirect to="/main" />
                    </Switch>
                )
            case 'hr':
                return(
                    <Switch>
                        <Route path="/main" exact>
                            <HrPage />
                        </Route>

                        <Route path="/showList" exact>
                            <HrShowPage />
                        </Route>

                        <Route path="/createUser" exact>
                            <CreateUserPage />
                        </Route>

                        <Route path="/createPlan" exact>
                            <CreatePlanPage />
                        </Route>

                        <Route path="/createPlan/:id" exact>
                            <CreatePlanPage />
                        </Route>
                        <Route path="/plan/:id" exact>
                            <PlanPage />
                        </Route>
                        <Redirect to="/main" />
                    </Switch>
                )
            case 'head':
                return(
                    <Switch>
                        <Route path="/main" exact>
                            <HeadPage />
                        </Route>
                        <Route path="/plan/:id" exact>
                            <PlanPage />
                        </Route>
                        <Redirect to="/main" />
                    </Switch>
                )
            default:break
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