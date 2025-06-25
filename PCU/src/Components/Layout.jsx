import {Outlet} from 'react-router-dom'
import NavbarComp from "./Navbar.jsx";


const Layout = () => {
    return (
        <>
            <NavbarComp/>
            <Outlet/>
        </>
    )
}
export default Layout