import { login_route, signup_route, profile_route, home_route } from "./Routes";

export { Routes, Route } from "react-router-dom"

const Router = () => {
    return (  
        <Routes>
            <Route path={login_route} element={Login} />
            <Route path={signup_route} element={SignUp} />
            <Route path={profile_route} element={Profile} />
            <Route path={home_route} element={Home} />
        </Routes>
    );
}
 
export default Router;