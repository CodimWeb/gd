import {Link, NavLink, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

import SidebarCollapse from "./SidebarCollapse";

import {setHasNewTask, toggleSidebar, closeSidebarOnTablet} from "../../store/slices/sidebarSlice";
import {useEffect, useState} from "react";
import api from "../../api";
import {removeUser} from "../../store/slices/userSlice";

const Sidebar = () => {
    const { t, i18n } = useTranslation();
    const {lang} = useParams()
    const isAuth = !!localStorage.getItem('accessToken')
    const user = useSelector(state => state.user.user)
    const isOpenSidebar = useSelector(state => state.sidebar.isOpen)
    const hasNewTask = useSelector(state => state.sidebar.hasNewTask)
    const dispatch = useDispatch()

    const [createdTask, setCreatedTask] = useState([])
    const [myOffersAccepted, setMyOffersAccepted] = useState([])
    const [myOffersNew, setMyOffersNew] = useState([])

    const fetchTasks = () => {
        api.get(`/api/user/task/list`).then((res) => {
            let myTasks = res.data.data.filter((task) => task.status !== 'closed')
            setCreatedTask(myTasks)
        })
        api.get(`/api/user/offer/list`).then((res) => {
            let acceptedOffers = res.data.data.filter(offer => offer.status === 'accepted')
            setMyOffersAccepted(acceptedOffers)

            let newOffers = res.data.data.filter(offer => offer.status === 'new')
            setMyOffersNew(newOffers)
        })
        dispatch(setHasNewTask(false))
    }

    const logout = () => {
        api.post('/api/auth/logout').then(() => {
            localStorage.removeItem('accessToken')
            dispatch(removeUser())
            navigate(`/${lang}/`);
        })
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    useEffect(() => {
        if(hasNewTask) {
            fetchTasks()
        }
    }, [hasNewTask])


    return (
        <div className={`sidebar ${isOpenSidebar ? 'open' : ''}`}>

            <button className="btn btn-sidebar-toggle" onClick={() => dispatch(toggleSidebar())}>
                <i className="icon icon-arrow-down-long"></i>
            </button>
            <div className="sidebar-content">
                <div className="sidebar-mobile-panel">
                    <div className="sidebar-mobile-user">
                        {user?.avatar ?
                            <div className="header-user-avatar">
                                <img src={user.avatar} alt=""/>
                            </div>
                            :
                            <i className="icon icon-user-circle"></i>
                        }

                        <div className="header-user-name">
                            {user.username}
                        </div>
                        <div className="sidebar-mobile-panel__logout">
                            <i className="icon icon-logout" onClick={logout}></i>
                        </div>
                    </div>
                    <div className="sidebar-mobile-nav">
                        <NavLink
                            to={`/${lang}/create-task`}
                            className="sidebar-mobile-nav-link"
                            onClick={() => { dispatch(toggleSidebar()) }}
                        >
                            { t('Create task') }
                        </NavLink>
                        <NavLink
                            to={`/${lang}/`}
                            className="sidebar-mobile-nav-link"
                            onClick={() => { dispatch(toggleSidebar()) }}
                        >
                            { t('Find task') }
                        </NavLink>
                    </div>
                </div>
                <div className="sidebar-header">
                    <div className="sidebar-title">{ t('My tasks') }</div>
                </div>
                <div className="sidebar-body">
                    <div className="sidebar-part">
                        <div className="sidebar-part__title">{ t('Created') }</div>
                        {createdTask.map(task =>
                            <SidebarCollapse
                                key={task.id}
                                title={task.name}
                                id={task.id}
                                offer={task.accepted_offer}
                        />)}
                        <div className="sidebar-part__divider"> </div>
                    </div>
                    <div className="sidebar-part">
                        <div className="sidebar-part__title">{ t('Executed') }</div>
                        {myOffersAccepted.map(offer => (
                            <Link to={`/${lang}/task/${offer.task.id}/chat`}
                                  className="sidebar-part__link"
                                  key={offer.id}
                                  onClick={() => { dispatch(closeSidebarOnTablet()) }}
                            >
                                {offer.task.name}
                            </Link>
                        ))}
                        <div className="sidebar-part__divider"> </div>
                    </div>
                    <div className="sidebar-part">
                        <div className="sidebar-part__title">{ t('Response (Waiting)') }</div>
                        {myOffersNew.map(offer => (
                            <Link to={`/${lang}/task/${offer.task.id}/chat`}
                                  className="sidebar-part__link"
                                  key={offer.id}
                                  onClick={() => { dispatch(closeSidebarOnTablet()) }}
                            >
                                {offer.task.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
