import { Link } from "react-router-dom";
import { home_route, profile_route, signup_route } from "../Router/Routes";

const Navbar = () => {
    return ( 
        <nav>
            <ul>
                <li><Link to={home_route}>Home</Link></li>
                <li><Link to={profile_route}>Profile</Link></li>
                <li><Link to={signup_route}>SignUp</Link></li>
            </ul>
        </nav>
     );
}
 
export default Navbar;