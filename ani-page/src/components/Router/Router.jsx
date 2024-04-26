import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";
import ItemPage from "../Content/ItemPage";
import Home from "../Home/Home";
import Profile from "../Profile/Profile";
import { login_route, signup_route, profile_route, home_route, item_route } from "./Routes";
import { Routes, Route } from "react-router-dom"

const Router = () => {
    return (  
        <Routes>
            <Route path={home_route} element={<Home />} />
            <Route path={login_route} element={<Login />} />
            <Route path={signup_route} element={<SignUp />} />
            <Route path={profile_route} element={<Profile />} />
            <Route path={item_route} element={<ItemPage />} />
        </Routes>
    );
}
 
export default Router;