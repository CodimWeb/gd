import {useEffect, useState, useRef, useReducer} from "react";
import {Link, useParams, useNavigate, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import Header from "../../components/Header/Header.jsx";
import Wrapper from "../../components/Wrappwer/Wrapper";
import ModalTaskFinish from "../../components/Modal/ModalTaskFinish";
import api from "../../api";
import moment from "moment";
import PageLoader from "../../components/Loader/PageLoader";

import ChatHeaderImg from '../../../img/chat-header.png'
import ChatSend from '../../../img/chat-send.png'

import Page404 from "../Page404/Page404";


const Chat = () => {
    const { t } = useTranslation()

    const {lang, id} = useParams()
    const [searchParams, setSearchParams] = useSearchParams();

    const [task, setTask] = useState({})
    const [user, setUser] = useState()
    const [userRole, setUserRole] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // const user = useSelector(state => state.user.user)
    const notification = useSelector(state => state.notification.notification)

    const [selectedOffer, setSelectedOffer] = useState(null)
    const [message, setMessage] = useState('')
    const [dialog, setDialog] = useState([])
    const [acceptedOffer, setAcceptedOffer] = useState(null)
    const [isAcceptedOffer, setIsAcceptedOffer] = useState(null)
    const [isRejectedOffer, setIsRejectedOffer] = useState(null)
    const [offerList, setOfferList] = useState([])
    const [isShowPageLoader, setIsShowPageLoader] = useState(true)
    const [isOpenChatList, setIsOpenChatList] = useState(false)

    const dialogInterval = useRef()
    const abortController = useRef()
    abortController.current = null

    let rejectedNotification = notification.find(notification => notification.type == 'offer_rejected' && notification?.params.task_id == id)
    let acceptedNotification = notification.find(notification => notification.type == 'offer_accepted' && notification?.params.task_id == id)
    if(rejectedNotification) {
        if(!isRejectedOffer) {
            setIsRejectedOffer(true)
        }
    }
    if(acceptedNotification) {
        if(!isAcceptedOffer) {
            setIsAcceptedOffer(true)
        }
    }

    const [showTaskFinish, setShowTaskFinish] = useState(false);
    const handleShowTaskFinish = () => setShowTaskFinish(true);
    const handleCloseTaskFinish = () => setShowTaskFinish(false);

    const fetchData = () => {
        let p = [];
        p.push(api.get('/api/user'))
        p.push(api.get(`/api/task/${id}/visitor`))
        p.push(api.get(`/api/user/offer/list`));


        Promise.all(p).then(res => {
            const user = res[0].data.data
            let task = res[1].data.data
            let offers = res[2].data.data

            setUser(user)

            if(task && !task.offers) {
                setUserRole('candidate')
                setTask(task)
                let rejectedOffer = offers.find(offer => offer.status == 'rejected' && offer.task_id == id)

                if(rejectedOffer) {
                    setIsRejectedOffer(true)
                    navigate(`/${lang}/task/${id}`)
                }
            }
            else {
                setUserRole('author')
                chekOfferAccepted(task)
            }

            setOfferList(offers)


            // если у юзера нат отклика на это задание
            if(task && task.user_id != user.id && !offers.some(offer => offer.task_id == id)) {
                navigate(`/${lang}/task/${task.id}`)
            }

            let acceptedOffer =  offers.find(offer => offer.status == 'accepted' && offer.user_id == user.id && offer.task_id == task.id)
            if(acceptedOffer?.id) {
                setAcceptedOffer(acceptedOffer)
            }
            setIsShowPageLoader(false)
        })
    }

    useEffect(() => {
        setTimeout(() => {
            scrollChat()
        }, 700)

        return () => {
            clearInterval(dialogInterval.current)
        }
    }, [])

    useEffect(() => {
        setMessage('')
        // setDialog([])
        setAcceptedOffer(null)
        setOfferList([])
        if(selectedOffer != null) {
            setSelectedOffer(null)
        }
        fetchData()
    }, [id, searchParams.get('user')])

    useEffect(() => {
        chekOfferAccepted(task)
    }, [isAcceptedOffer])

    useEffect(() => {
        if(selectedOffer) {
            clearInterval(dialogInterval.current)
            fetchMessages()
            dialogInterval.current = setInterval(() => {
                fetchMessages()
            }, 5000)
        }
    }, [selectedOffer])

    useEffect(() => {
        if(userRole === 'candidate') {
            clearInterval(dialogInterval.current)
            fetchMessages()
            dialogInterval.current = setInterval(() => {
                fetchMessages()
            }, 5000)
        }
    }, [userRole])

    useEffect(() => {
        if(dialog.some(message => message.read == false)) {
            scrollChat()
        }
    }, [dialog])

    useEffect(() => {
        clearInterval(dialogInterval.current)
        fetchMessages()
        dialogInterval.current = setInterval(() => {
            fetchMessages()
        }, 5000)
    }, [task])



    const chekOfferAccepted = (task) => {

        const userId = searchParams.get('user')
        if(userId) {
            const offer = task?.offers?.find(offer => offer.user_id == userId)
            if(offer) {
                setSelectedOffer(offer)
                api.post(`/api/user/chat/message/read-all`).then((res) => {

                })
            }
        }
        else {
            task?.offers?.forEach((offer) => {
                if(offer.status == 'accepted') {
                    task.offers = task.offers.filter(offer => offer.status == 'accepted')
                    setTask(task)
                    setSelectedOffer(offer)
                }
            })
        }

        setTask(task)
    }

    const fetchMessages = () => {

        if(abortController.current != null) {
            abortController.current.abort()
        }

        abortController.current = new AbortController()

        if(userRole === 'author' && selectedOffer) {
            const chat = selectedOffer.user.chats.find((chat) => chat.task_id == task.id)
            if(chat) {
                api.get(`/api/user/chat/${chat.id}/messages`, {signal: abortController.current.signal}).then((res) => {
                    setDialog(res.data.data)

                    api.post(`/api/user/chat/message/read-all`).then((res) => {

                    })
                })
            }

        }
        else if(userRole === 'candidate') {
            let chat = user.chats.find(chat => chat.task_id == task.id)
            if(chat) {
                api.get(`/api/user/chat/${chat.id}/messages`, {signal: abortController.current.signal}).then((res) => {
                    setDialog(res.data.data)

                    api.post(`/api/user/chat/message/read-all`).then((res) => {

                    })
                })
            }

        }
    }

    const scrollChat = () => {
        document.querySelector('.dialog-wrapper').scrollTo(0, document.querySelector('.dialog-wrapper').scrollHeight)
    }

    const applyOffer = () => {
        api.post(`/api/task/offer/${selectedOffer.id}/accept`).then((res) => {
            if(res.data.success) {
                let newTask = JSON.parse(JSON.stringify(task))
                newTask.offers.forEach((offer) => {
                    if(offer.id == selectedOffer.id) {
                        offer.status = 'accepted'
                        chekOfferAccepted(newTask)
                    }
                })
            }
        })
    }

    const rejectOffer = () => {
        if(userRole === 'author' && selectedOffer) {
            api.post(`/api/task/offer/${selectedOffer.id}/reject`).then((res) => {
                if(res.data.success) {
                    let newTask = JSON.parse(JSON.stringify(task))
                    let rejectedOffer = newTask.offers.find(offer => selectedOffer.id == offer.id)
                    rejectedOffer.status = 'rejected'
                    setTask(newTask)
                    setSelectedOffer(null)
                }
            })
        }
        else if(userRole === 'candidate') {
            let offer = offerList.find(offer => offer.task_id == task.id)
            api.post(`/api/task/offer/${offer.id}/reject`).then((res) => {
                navigate(`/${lang}/`)
            })
        }
    }

    const cancelSelfOffer = () => {
        let offer = offerList.find(offer => offer.task_id == task.id)
        api.delete(`/api/user/offer/remove/${offer.id}`).then((res) => {
            navigate(`/${lang}/`)
        })
    }

    const sendMessage = () => {
        if(message.length > 0) {
            let chatId
            if(userRole === 'author') {
                const chat = selectedOffer.user.chats.find((chat) => chat.task_id == task.id)
                chatId = chat.id
            }
            else if(userRole === 'candidate') {
                const chat = user.chats.find(chat => chat.task_id == task.id)
                chatId = chat.id
            }
            api.post(`/api/user/chat/${chatId}/message`, {message: message}).then((res) => {
                setMessage('')
                setDialog(res.data.data)
                // scrollChat()
            })
        }
    }

    const formatTime = (time) => {
        let date = new Date(time)
        let formattedDate = moment(date).format('DD.MM.YYYY HH:mm');
        return formattedDate.toString()
    }

    const getMobileUserList = () => {
        // setSelectedOffer(null)
        clearInterval(dialogInterval.current)
        // setSearchParams('')
        toggleChatList()
    }

    const toggleChatList = () => {
        setIsOpenChatList(!isOpenChatList)
    }


    if(isShowPageLoader) {
        return <PageLoader />
    }
    else {
        if (task) {
            return (
                <>
                    <Header/>
                    <Wrapper>
                        <div className="chat-container">
                            <div className={`chat-list ${isOpenChatList ? 'open' : '' }`}>
                                <div className="chat-list__content">
                                    <div className="chat-list__header">
                                        <p className="h1 chat-list__title">{ t('Chats') }</p>
                                    </div>
                                    <div className="chat-list__body">
                                        {userRole === 'author' && task.offers?.map((offer) => {
                                            if (offer.status !== 'rejected') {
                                                return (
                                                    <Link to={`/${lang}/task/${id}/chat?user=${offer.user_id}`}
                                                        className={`chat-list__item ${selectedOffer?.id == offer.id ? 'active' : ''}`}
                                                        key={offer.id}
                                                        onClick={toggleChatList}
                                                    >
                                                        {offer.user.avatar ?
                                                            <div className="chat-list__item__photo">
                                                                <img src={offer.user.avatar} alt=""/>
                                                            </div>
                                                            :
                                                            <div className="chat-list__item__photo">
                                                                <i className="icon icon-user-circle"></i>
                                                            </div>
                                                        }

                                                        <div className="chat-list__item__data">
                                                            <div
                                                                className="chat-list__item__user-name">{offer.user.username}</div>
                                                            {/*<div className="chat-list__item__message-preview">Вы: Текст текст текст Текст текст текст</div>*/}
                                                        </div>
                                                        {/*<div className="chat-list__item__notify">2</div>*/}
                                                    </Link>
                                                )
                                            }
                                        })}

                                        {userRole === 'candidate' &&
                                        <div className={`chat-list__item active`} onClick={toggleChatList}>
                                            {task.user?.avatar ?
                                                <div className="chat-list__item__photo">
                                                    <img src={task.user?.avatar} alt=""/>
                                                </div>
                                                :
                                                <div className="chat-list__item__photo">
                                                    <i className="icon icon-user-circle"></i>
                                                </div>
                                            }

                                            <div className="chat-list__item__data">
                                                <div className="chat-list__item__user-name">{task.user?.username}</div>
                                                {/*<div className="chat-list__item__message-preview">Вы: Текст текст текст Текст текст текст</div>*/}
                                            </div>
                                            {/*<div className="chat-list__item__notify">2</div>*/}
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="chat-panel">
                                <div className="chat-header">
                                    <div className="chat-header--desktop">
                                        <i className="icon icon-arrow-down-long" onClick={getMobileUserList}></i>
                                        <div className="chat-header__logo">
                                            <img src={ChatHeaderImg} alt=""/>
                                        </div>
                                        <div className="h3 chat-header__title">{task.name}</div>
                                    </div>
                                    <div className="chat-header--mobile">
                                        {userRole === 'author' && selectedOffer &&
                                            <>
                                                {selectedOffer.status == 'new' &&
                                                <>
                                                    <div className="chat-sidebar__action">
                                                        <button className="btn btn-aqua-gradient btn-block"onClick={applyOffer}>
                                                            { t('Select') }
                                                        </button>
                                                    </div>
                                                    <div className="chat-sidebar__action">
                                                        <button className="btn btn-cancel btn-block" onClick={rejectOffer}>
                                                            { t('Reject') }
                                                        </button>
                                                    </div>
                                                </>
                                                }
                                                {selectedOffer.status == 'accepted' &&
                                                <>
                                                    <div className="chat-sidebar__action">
                                                        <button className="btn btn-aqua-gradient btn-block" onClick={handleShowTaskFinish}>
                                                            { t('Complete') }
                                                        </button>
                                                    </div>
                                                </>
                                                }
                                            </>
                                        }
                                        {userRole === 'candidate' &&
                                            <>
                                                {!isRejectedOffer ?
                                                    <div className="chat-sidebar__action">
                                                        {isAcceptedOffer ?
                                                            <div>
                                                                {task.status === 'done' ?
                                                                    <div>{ t('You have completed the task') }</div>
                                                                    :
                                                                    <button className="btn btn-aqua-gradient btn-block"
                                                                            onClick={handleShowTaskFinish}>{ t('Complete') }</button>
                                                                }

                                                            </div>

                                                            :
                                                            <button className="btn btn-cancel btn-block"
                                                                    onClick={cancelSelfOffer}>{ t('Revoke') }</button>
                                                        }
                                                    </div>
                                                    :
                                                    <div>
                                                        {t('Your application has been rejected')}
                                                    </div>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>

                                {userRole === 'author' && selectedOffer &&
                                <>
                                    <div className="chat-body">
                                        {dialog.length == 0 &&
                                        <div className="chat-empty">
                                            <div className="chat-empty__content">
                                                <i className="icon icon-chat"></i>
                                                <div className="h2 chat-empty__title">{ t('Chat is empty') }</div>
                                                <div className="h2 chat-empty__subtitle">{ t('Write something to chat') }</div>
                                            </div>
                                        </div>
                                        }
                                        <div className="dialog-wrapper">
                                            {dialog.length > 0 &&
                                            <div className="dialog">
                                                {
                                                    dialog.map((item) => (
                                                        <div
                                                            className={`dialog-item ${item.user_id == user.id ? 'dialog-item--right' : ''}`}
                                                            key={item.id}>
                                                            <div className="dialog-item__content">
                                                                <div className="dialog-item__header">
                                                                    {item.user_id == user.id &&
                                                                    <div className="dialog-item__img">
                                                                        {user.avatar ?
                                                                            <img src={user.avatar} alt=""/>
                                                                            :
                                                                            <i className="icon icon-user-circle"></i>
                                                                        }
                                                                    </div>
                                                                    }

                                                                    {item.user_id != user.id &&
                                                                    <div className="dialog-item__img">
                                                                        {selectedOffer.user.avatar ?
                                                                            <img src={selectedOffer.user.avatar}
                                                                                 alt=""/>
                                                                            :
                                                                            <i className="icon icon-user-circle"></i>
                                                                        }
                                                                    </div>
                                                                    }


                                                                    <div className="dialog-item__user-name">{
                                                                        item.user_id == user.id ? user.username : selectedOffer.user.username}
                                                                    </div>
                                                                </div>
                                                                <div className="dialog-item__body">
                                                                    <div
                                                                        className="dialog-item__text">{item.message}</div>
                                                                    <div className="dialog-item__info">
                                                                        <div
                                                                            className="dialog-item__time">{formatTime(item.created_at)}</div>
                                                                        {/*<div className="dialog-item__icon">*/}
                                                                        {/*    <i className="icon icon-check_all"></i>*/}
                                                                        {/*</div>*/}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="chat-footer">
                                        <div className="chat-footer__message-wrapper">
                                            {/*<img src={IconSmile} className="icon-smile" alt=""/>*/}
                                            <textarea id="chat-message"
                                                      className="form-control chat-footer__textarea"
                                                      placeholder={t('Enter message')}
                                                      value={message}
                                                      onChange={e => setMessage(e.target.value)}
                                            ></textarea>
                                            {/*<label htmlFor="chat-message" className="chat-footer__textarea__placeholder">Введите сообщение</label>*/}
                                        </div>
                                        <div className="chat-send">
                                            <img src={ChatSend} alt="" onClick={sendMessage}/>
                                        </div>
                                    </div>
                                </>
                                }
                                {userRole === 'candidate' && !isRejectedOffer &&
                                <>
                                    <div className="chat-body">
                                        {dialog.length == 0 &&
                                        <div className="chat-empty">
                                            <div className="chat-empty__content">
                                                <i className="icon icon-chat"></i>
                                                <div className="h2 chat-empty__title">{ t('Chat is empty') }</div>
                                                <div className="h2 chat-empty__subtitle">{ t('Write something to chat') }</div>
                                            </div>
                                        </div>
                                        }
                                        <div className="dialog-wrapper">
                                            {dialog.length > 0 &&
                                            <div className="dialog">
                                                {
                                                    dialog.map((item) => (
                                                        <div
                                                            className={`dialog-item ${item.user_id == user.id ? 'dialog-item--right' : ''}`}
                                                            key={item.id}>
                                                            <div className="dialog-item__content">
                                                                <div className="dialog-item__header">
                                                                    {item.user_id == user.id &&
                                                                    <div className="dialog-item__img">
                                                                        {user.avatar ?
                                                                            <img src={user.avatar} alt=""/>
                                                                            :
                                                                            <i className="icon icon-user-circle"></i>
                                                                        }
                                                                    </div>
                                                                    }

                                                                    {item.user_id != user.id &&
                                                                    <div className="dialog-item__img">
                                                                        {task.user.avatar ?
                                                                            <img src={task.user.avatar} alt=""/>
                                                                            :
                                                                            <i className="icon icon-user-circle"></i>
                                                                        }

                                                                    </div>
                                                                    }

                                                                    <div className="dialog-item__user-name">
                                                                        {item.user_id == user.id ? user.username : task.user.username}
                                                                    </div>
                                                                </div>
                                                                <div className="dialog-item__body">
                                                                    <div
                                                                        className="dialog-item__text">{item.message}</div>
                                                                    <div className="dialog-item__info">
                                                                        <div
                                                                            className="dialog-item__time">{formatTime(item.created_at)}</div>
                                                                        {/*<div className="dialog-item__icon">*/}
                                                                        {/*    <i className="icon icon-check_all"></i>*/}
                                                                        {/*</div>*/}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="chat-footer">
                                        <div className="chat-footer__message-wrapper">
                                            {/*<img src={IconSmile} className="icon-smile" alt=""/>*/}
                                            <textarea id="chat-message"
                                                      className="form-control chat-footer__textarea"
                                                      placeholder={ t('Enter message') }
                                                      value={message}
                                                      onChange={e => setMessage(e.target.value)}
                                            ></textarea>
                                            {/*<label htmlFor="chat-message" className="chat-footer__textarea__placeholder">Введите сообщение</label>*/}
                                        </div>
                                        <div className="chat-send">
                                            <img src={ChatSend} alt="" onClick={sendMessage}/>
                                        </div>
                                    </div>
                                </>
                                }
                            </div>
                            <div className="chat-sidebar">
                                {userRole === 'author' && selectedOffer &&
                                <>
                                    <div className="h1 chat-sidebar__title">{ t('Executor') }</div>
                                    <div className="chat-sidebar__content">
                                        <div className="chat-sidebar__user-photo">
                                            {selectedOffer?.user.avatar ?
                                                <img src={selectedOffer?.user.avatar} alt=""/>
                                                :
                                                <i className="icon icon-user-circle"></i>
                                            }

                                        </div>
                                        <div className="chat-sidebar__user-name">
                                            <i className="icon icon-user"></i>
                                            {selectedOffer?.user.username}
                                        </div>
                                        {selectedOffer.status == 'new' &&
                                        <>
                                            <div className="chat-sidebar__action">
                                                <button className="btn btn-aqua-gradient btn-block" onClick={applyOffer}>
                                                    { t('Select') }
                                                </button>
                                            </div>
                                            <div className="chat-sidebar__action">
                                                <button className="btn btn-cancel btn-block" onClick={rejectOffer}>
                                                    { t('Reject') }
                                                </button>
                                            </div>
                                        </>
                                        }
                                        {selectedOffer.status == 'accepted' &&
                                        <>
                                            <div className="chat-sidebar__action">
                                                <button className="btn btn-aqua-gradient btn-block" onClick={handleShowTaskFinish}>
                                                    { t('Complete') }
                                                </button>
                                            </div>
                                        </>
                                        }
                                    </div>
                                </>
                                }

                                {userRole === 'candidate' &&
                                <>
                                    <div className="h1 chat-sidebar__title">{ t('Employer') }</div>
                                    <div className="chat-sidebar__content">
                                        <div className="chat-sidebar__user-photo">
                                            {task?.user.avatar ?
                                                <img src={task?.user.avatar} alt=""/>
                                                :
                                                <i className="icon icon-user-circle"></i>
                                            }
                                        </div>
                                        <div className="chat-sidebar__user-name">
                                            <i className="icon icon-user"></i>
                                            {task?.user.username}
                                        </div>
                                        {!isRejectedOffer ?
                                            <div className="chat-sidebar__action">
                                                {isAcceptedOffer ?
                                                    <div>
                                                        {task.status === 'done' ?
                                                            <div>{ t('You have completed the task') }</div>
                                                            :
                                                            <button className="btn btn-aqua-gradient btn-block"
                                                                    onClick={handleShowTaskFinish}>{ t('Complete') }</button>
                                                        }

                                                    </div>

                                                    :
                                                    <button className="btn btn-cancel btn-block"
                                                            onClick={cancelSelfOffer}>{ t('Revoke') }</button>
                                                }
                                            </div>
                                            :
                                            <div>
                                                { t('Your application has been rejected') }
                                            </div>
                                        }
                                    </div>
                                </>
                                }
                            </div>
                        </div>
                        <ModalTaskFinish
                            task={task}
                            isAuthor={task.user?.id == user.id}
                            updateTask={setTask}
                            showTaskFinish={showTaskFinish}
                            handleShowTaskFinish={handleShowTaskFinish}
                            handleCloseTaskFinish={handleCloseTaskFinish}
                        />
                    </Wrapper>
                </>
            )
        }
        else {
            return <Page404/>
        }
    }
}

export default Chat
