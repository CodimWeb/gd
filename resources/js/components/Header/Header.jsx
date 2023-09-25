import {useState, useEffect, useRef} from "react";
import {Link, NavLink, useNavigate, useParams, useLocation, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import VerifyNotify from "./VerifyNotify";
import {toggleSidebar} from "../../store/slices/sidebarSlice";

import api from "../../api";
import {fetchUser, removeUser} from "../../store/slices/userSlice";
import {fetchNotification} from "../../store/slices/notificationSlice";

import Dropdown from "react-bootstrap/Dropdown";
import ModalRegistration from "../Modal/ModalRegistration";
import ModalLogin from "../Modal/ModalLogin";
import ModalRegistrationFinish from "../Modal/ModalRegistrationFinish";
import ModalVerifyFinish from "../Modal/ModalVerifyFinish";
import ModalForgotPassword from "../Modal/ModalForgotPassword";
import ModalNewPassword from "../Modal/ModalNewPassword";

import Logo from "../../../img/logo.svg"
import iconRu from "../../../img/RU.svg"
import iconUs from "../../../img/US.svg"




const Header = () => {
    const { lang, hash } = useParams()
    const {pathname} = useLocation()
    const [searchParams, setSearchParams] = useSearchParams();

    let params = window.location.pathname.split('/')
    const searchQuery = window.location.search
    params = params.slice(2)
    const newPath = `${params.join('/')}${searchQuery}`

    const { t, i18n } = useTranslation();
    const isAuth = !!localStorage.getItem('accessToken')
    const user = useSelector(state => state.user.user)
    const notification = useSelector(state => state.notification.notification)

    const isOpenSidebar = useSelector(state => state.sidebar.isOpen)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showRegistration, setShowRegistration] = useState(false);
    const handleShowRegistration = () => setShowRegistration(true);
    const handleCloseRegistration = () => setShowRegistration(false);

    const [showLogin, setShowLogin] = useState(false);
    const handleShowLogin = () => setShowLogin(true);
    const handleCloseLogin = () => {
        setShowLogin(false);
        setSearchParams(`show-login=close`)
    }

    const [showRegistrationFinish, setShowRegistrationFinish] = useState(false);
    const handleShowRegistrationFinish = () => setShowRegistrationFinish(true);
    const handleCloseRegistrationFinish = () => setShowRegistrationFinish(false);

    const [showVerifyFinish, setShowVerifyFinish] = useState(false);
    const handleShowVerifyFinish = () => setShowVerifyFinish(true);
    const handleCloseVerifyFinish = () => {
        setShowVerifyFinish(false);
        navigate(`/${lang}/`)
    }

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const handleShowForgotPassword = () => setShowForgotPassword(true);
    const handleCloseForgotPassword = () => setShowForgotPassword(false);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleShowNewPassword = () => setShowNewPassword(true);
    const handleCloseNewPassword = () => setShowNewPassword(false);


    const notificationInterval = useRef(null);
    const newMessagesInterval = useRef(null)

    const [newMessages, setNewMessages] = useState([])

    const logout = () => {
        api.post('/api/auth/logout').then(() => {
            localStorage.removeItem('accessToken')
            dispatch(removeUser())
            navigate(`/${lang}/`);
        })
    }

    const fetchNewMessages = () => {
        api.get(`/api/user/chat/new-messages`).then((res) => {
            setNewMessages(res.data.data)
        })
    }

    const removeNotify = (item) => {
        api.post(`/api/user/notification/${item.id}/read`).then((res) => {
            if(res.data.success) {
                dispatch(fetchNotification())
            }
        })
    }

    const removeNotifyAll = (item) => {
        api.post(`/api/user/notification/read-all`).then((res) => {
            if(res.data.success) {
                dispatch(fetchNotification())
            }
        })
    }

    useEffect(() => {
        if(isAuth) {
            dispatch(fetchUser())

            dispatch(fetchNotification())
            notificationInterval.current = setInterval(() => {
                dispatch(fetchNotification())
            }, 5000)

            fetchNewMessages()
            newMessagesInterval.current = setInterval(() => {
                fetchNewMessages()
            }, 5000)

        }
        if(searchParams.get('verification') === 'success') {
            setShowVerifyFinish(true)
        }
        if(hash) {
            setShowNewPassword(true)
        }

        return () => {
            clearInterval(notificationInterval.current)
            clearInterval(newMessagesInterval.current)
        }

    }, [])

    useEffect(() => {
        if(searchParams.get('show-login') === 'open') {
            setShowLogin(true)
        }
    }, [searchParams.get('show-login')])

    useEffect(() => {
        i18n.changeLanguage(lang)
    }, [lang])


    return (
        <>
            {user?.email && !user.email_verified_at && <VerifyNotify />}

            <div className={`header ${isAuth ? 'auth' : ''} ${user?.email && !user.email_verified_at ? 'open-verify' : ''}`}>
                <div className="header-nav">
                    <Link to={`/${lang}/`} className="header-logo">
                        <img src={Logo} alt=""/>
                    </Link>
                    {isAuth ?
                        <>
                            <NavLink to={`/${lang}/create-task`} className="header-nav-link">{ t('Create task') }</NavLink>
                            <NavLink to={`/${lang}/`} className="header-nav-link">{ t('Find task') }</NavLink>
                        </>
                        :
                        <>
                            <NavLink to={`${lang}/create-task`} className="header-nav-link" onClick={ (e) => {e.preventDefault(); handleShowLogin()}}>
                                { t('Create task') }
                            </NavLink>
                            <NavLink to={`/${lang}/`} className="header-nav-link">
                                { t('Find task') }
                            </NavLink>
                        </>
                    }
                </div>
                <div className="header-lang">
                    <Dropdown className="dropdown-lang" key={lang}>
                        <Dropdown.Toggle>
                            <i className="icon icon-world"></i>
                            <i className="icon icon-arrow-down"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <div className="dropdown-item">
                                <Link to={`/ru/${newPath}`} className={`header-lang-link ${lang === 'ru' ? 'active' : ''}`}>
                                    <img src={iconRu} alt=""/>
                                    RU
                                </Link>
                            </div>
                            <div className="dropdown-item">
                                <Link to={`/en/${newPath}`} className={`header-lang-link ${lang === 'en' ? 'active' : ''}`}>
                                    <img src={iconUs} alt=""/>
                                    EN
                                </Link>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="header-action">

                    {isAuth &&
                        <>
                            {/*empty*/}
                            <div className="header-notify">
                                <Dropdown
                                    className={`base-dropdown dropdown-notify dropdown-notify-chat ${newMessages.length == 0 ? 'empty' : ''}`}
                                    align="end"
                                >
                                    <Dropdown.Toggle>
                                        <i className="icon icon-chat"></i>
                                        {newMessages.length > 0 &&
                                            <div className="dropdown-notify__count">{newMessages.length}</div>
                                        }
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {newMessages.length == 0 ?
                                            <div className="dropdown-menu__content">
                                                <div className="dropdown-menu__header">
                                                    <div className="dropdown-menu__header__title">{ t('Chats') }</div>
                                                </div>
                                                <div className="dropdown-menu__body">
                                                    <i className="icon icon-chat"></i>
                                                    <p className="dropdown-menu__body__title">{ t('No chats') }</p>
                                                    <p className="dropdown-menu__body__subtitle">{ t('Your recent chats will be displayed here') }</p>
                                                </div>
                                            </div>
                                            :
                                            <div className="dropdown-menu__content">
                                                <div className="dropdown-menu__header">
                                                    <div className="dropdown-menu__header__title">{ t('Chats') }</div>
                                                    {/*<Dropdown className="base-dropdown dropdown-chat-clear" align="end">*/}
                                                    {/*    <Dropdown.Toggle>*/}
                                                    {/*        <i className="icon icon-more"></i>*/}
                                                    {/*    </Dropdown.Toggle>*/}

                                                    {/*    <Dropdown.Menu>*/}
                                                    {/*        <button className="btn btn-clear">*/}
                                                    {/*            <i className="icon icon-delete"></i>*/}
                                                    {/*            Очистить*/}
                                                    {/*        </button>*/}
                                                    {/*    </Dropdown.Menu>*/}
                                                    {/*</Dropdown>*/}
                                                </div>
                                                <div className="dropdown-menu__body">
                                                    {/*<div className="dropdown-notify__label">Новые</div>*/}
                                                    {newMessages.map((item) => {
                                                        if (!item.read) {
                                                            return (
                                                                <Link to={`/${lang}/task/${item.task_id}/chat?user=${item.user_id}`}
                                                                      className="dropdown-notify-item" key={item.id}>
                                                                    <div className="dropdown-notify-item__logo">
                                                                        <div className="dropdown-notify-item__logo__container">
                                                                            {item?.user?.avatar ?
                                                                                <img src={item.user.avatar} alt=""/>
                                                                                :
                                                                                <i className="icon icon-user"></i>
                                                                            }

                                                                        </div>
                                                                    </div>
                                                                    <div className="dropdown-notify-item__body">
                                                                        <div className="dropdown-notify-item__username dropdown-notify-item__username--mb">
                                                                            {item.user.username}
                                                                            {/*<div className="dropdown-notify-item__count">2</div>*/}
                                                                        </div>
                                                                        <div className="dropdown-notify-item__preview">
                                                                            <div className="dropdown-notify-item__preview-text">{item.message}</div>
                                                                            <div className="dropdown-notify-item__preview-link">{ t('Read') }</div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            )
                                                        }
                                                    })}

                                                </div>
                                                {/*<div className="dropdown-menu__footer">*/}
                                                {/*    <Link to={`/${lang}/cabinet/chat`} className="dropdown-menu__show-all">Посмотреть всё</Link>*/}
                                                {/*</div>*/}
                                            </div>
                                        }

                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <div className="header-notify">
                                <Dropdown className={`base-dropdown dropdown-notify dropdown-notify-task ${notification.length == 0 ? 'empty' : ''}`}
                                          align="end"
                                >
                                    <Dropdown.Toggle>
                                        <i className="icon icon-notify"></i>
                                        {notification.length > 0 &&
                                            <div className="dropdown-notify__count">{notification.length}</div>
                                        }

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {notification.length == 0 ?
                                            <div className="dropdown-menu__content">
                                                <div className="dropdown-menu__header">
                                                    <div className="dropdown-menu__header__title">{ t('Notification') }</div>
                                                </div>
                                                <div className="dropdown-menu__body">
                                                    <i className="icon icon-notify"></i>
                                                    <p className="dropdown-menu__body__title">{ t('No notifications') }</p>
                                                    <p className="dropdown-menu__body__subtitle">{ t('Your recent notifications will be displayed here') }</p>
                                                </div>
                                            </div>
                                            :
                                            <div className="dropdown-menu__content">
                                                <div className="dropdown-menu__header">
                                                    <div className="dropdown-menu__header__title">{ t('Notification') }</div>
                                                    {/*<Dropdown className="base-dropdown dropdown-chat-clear" align="end">*/}
                                                    {/*    <Dropdown.Toggle>*/}
                                                    {/*        <i className="icon icon-more"></i>*/}
                                                    {/*    </Dropdown.Toggle>*/}

                                                    {/*    <Dropdown.Menu>*/}
                                                    {/*        <button className="btn btn-clear">*/}
                                                    {/*            <i className="icon icon-delete"></i>*/}
                                                    {/*            Очистить*/}
                                                    {/*        </button>*/}
                                                    {/*    </Dropdown.Menu>*/}
                                                    {/*</Dropdown>*/}
                                                </div>
                                                <div className="dropdown-menu__body">
                                                    {/*<div className="dropdown-notify__label">Новые</div>*/}
                                                    {notification.map(item => {
                                                        return (
                                                            <div className="dropdown-notify-item" key={item.id}>
                                                                {/*<div className="dropdown-notify-item__logo">*/}
                                                                {/*    <div className="dropdown-notify-item__logo__container">*/}
                                                                {/*        <img src={Avatar} alt=""/>*/}
                                                                {/*    </div>*/}
                                                                {/*</div>*/}
                                                                <div className="dropdown-notify-item__body"> {/* horizontal */}
                                                                    {/*<div className="dropdown-notify-item__username">User 24213 asdasdasdasd</div>*/}
                                                                    <div className="dropdown-notify-item__remove">
                                                                        <div
                                                                            className="dropdown-notify-item__remove-text"
                                                                            onClick={() => {removeNotify(item)}}
                                                                        >
                                                                            { t('Remove') }
                                                                        </div>
                                                                    </div>
                                                                    <div className="dropdown-notify-item__preview-text">
                                                                        { lang == 'ru' ? item.message : item.message_en}
                                                                    </div>
                                                                    {/*<p className="dropdown-notify-item__time">5 минут назад</p>*/}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="dropdown-menu__footer">
                                                    <div className="dropdown-menu__show-all" onClick={removeNotifyAll}>{ t('Remove all') }</div>
                                                </div>
                                            </div>
                                        }


                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="header-user-panel">
                                <Dropdown className="base-dropdown header-user-dropdown" key={pathname}>
                                    <Dropdown.Toggle>
                                        {user.avatar ?
                                            <div className="header-user-avatar">
                                                <img src={user.avatar} alt=""/>
                                            </div>
                                            :
                                            <i className="icon icon-user-circle"></i>
                                        }

                                        <div className="header-user-name">
                                            {user.username}
                                        </div>
                                        <i className="icon icon-arrow-down"></i>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <div className="dropdown-item">
                                            <div className="header-user-dropdown__text user-name">
                                                {user.avatar ?
                                                    <div className="header-user-avatar header-user-dropdown__avatar">
                                                        <img src={user.avatar} alt=""/>
                                                    </div>
                                                    :
                                                    <i className="icon icon-user"></i>
                                                }
                                                {user.username}
                                            </div>
                                        </div>
                                        <div className="dropdown-item">
                                            {/*<Link to={`/${lang}/cabinet/account`} className="header-user-dropdown__text">*/}
                                            {/*    <i className="icon icon-user"></i>*/}
                                            {/*    Профиль*/}
                                            {/*</Link>*/}

                                            {/*if return profile add class settings*/}
                                            <Link to={`/${lang}/cabinet/profile`} className="header-user-dropdown__text">
                                                <i className="icon icon-settings-future"></i>
                                                { t('Settings') }
                                            </Link>
                                        </div>
                                        <div className="dropdown-item">
                                            <div className="header-user-dropdown__text" onClick={logout}>
                                                <i className="icon icon-logout"></i>
                                                { t('Log out') }
                                            </div>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </>


                    }
                </div>
                {!isAuth &&
                    <div className="header-auth">
                        <button className="btn btn-ghost btn-header-register" onClick={handleShowRegistration}>
                            { t('Sign up') }
                        </button>
                        <button className="btn btn-aqua btn-header-login" onClick={handleShowLogin}>
                            { t('Log in') }
                        </button>
                    </div>
                }
                {isAuth &&
                    <div className="header-mobile-menu" onClick={() => {dispatch(toggleSidebar())}}>
                        {isOpenSidebar ?
                            <i className="icon icon-close"></i>
                            :
                            <i className="icon icon-menu"></i>
                        }
                    </div>
                }
            </div>

            {/* MODALS   */}
            {!isAuth &&
                <>

                    <ModalRegistration
                        show={showRegistration}
                        handleShowRegistration={handleShowRegistration}
                        handleCloseRegistration={handleCloseRegistration}
                        handleShowLogin={handleShowLogin}
                        handleShowRegistrationFinish={handleShowRegistrationFinish}
                    />
                    <ModalLogin
                        show={showLogin}
                        handleShowLogin={handleShowLogin}
                        handleCloseLogin={handleCloseLogin}
                        handleShowRegistration={handleShowRegistration}
                        handleShowForgotPassword={handleShowForgotPassword}
                    />
                </>
            }
            <ModalRegistrationFinish
                showRegistrationFinish={showRegistrationFinish}
                handleShowRegistrationFinish={handleShowRegistrationFinish}
                handleCloseRegistrationFinish={handleCloseRegistrationFinish}
            />
            <ModalVerifyFinish
                showVerifyFinish={showVerifyFinish}
                handleShowVerifyFinish={handleShowVerifyFinish}
                handleCloseVerifyFinish={handleCloseVerifyFinish}
            />
            <ModalForgotPassword
                showForgotPassword={showForgotPassword}
                handleShowForgotPassword={handleShowForgotPassword}
                handleCloseForgotPassword={handleCloseForgotPassword}
            />
            <ModalNewPassword
                showNewPassword={showNewPassword}
                handleShowNewPassword={handleShowNewPassword}
                handleCloseNewPassword={handleCloseNewPassword}
            />
        </>
    )
}

export default Header
