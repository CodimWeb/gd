import {useSelector} from "react-redux";
import { ToastContainer } from "react-toastify";
import Sidebar from "../Sidebar/Sidebar";

const Wrapper = ({children, className}) => {
    const isAuth = !!localStorage.getItem('accessToken')
    const isOpenSidebar = useSelector(state => state.sidebar.isOpen)
    const user = useSelector(state => state.user.user)

    return (
        <>
            <ToastContainer autoClose={4000} draggable={false}/>
            <div className={`wrapper ${className ? className : ''} ${user?.email && !user.email_verified_at ? 'open-verify' : ''}`} >
                <div className={`content ${isAuth ? 'auth' : ''} ${isOpenSidebar ? 'open' : ''}`}>
                    {children}
                </div>
                {isAuth && <Sidebar />}
            </div>
        </>

    )
}

export default Wrapper
