import {useEffect, useState} from "react";
import {Link, useParams, useSearchParams, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import Header from "../../components/Header/Header.jsx";
import Wrapper from "../../components/Wrappwer/Wrapper";
import ModalTaskFinish from "../../components/Modal/ModalTaskFinish";
import Page404 from "../Page404/Page404";
import PageLoader from "../../components/Loader/PageLoader";

import {setHasNewTask} from "../../store/slices/sidebarSlice";

import api from "../../api";
import {useTranslation} from "react-i18next";

const Task = () => {
    const { t } = useTranslation()
    const {lang, id} = useParams()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const [task, setTask] = useState({})
    const [myOffers, setMyOffers] = useState([])

    const isAuth = !!localStorage.getItem('accessToken')

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const hasNewTask = useSelector(state => state.sidebar.hasNewTask)

    const [showTaskFinish, setShowTaskFinish] = useState(false);
    const [offerStatus, setOfferStatus] = useState('');
    const [isUserHasOfferForTask, setIsUserHasOfferForTask] = useState(false)
    const [isShowPageLoader, setIsShowPageLoader] = useState(true)

    const handleShowTaskFinish = () => setShowTaskFinish(true);
    const handleCloseTaskFinish = () => setShowTaskFinish(false);

    const fetchData = () => {
        let taskRequest
        if(isAuth) {
            taskRequest = api.get(`/api/task/${id}/visitor`)
        }
        else {
            taskRequest = api.get(`/api/task/${id}`)
        }

        let p = [];
        p.push(taskRequest)
        if(isAuth) {
            p.push(api.get(`/api/user/offer/list`))
        }

        Promise.all(p).then(res => {
            let task = res[0].data.data
            setTask(task)

            let offers = isAuth ? res[1].data.data : []
            setMyOffers(offers)

            setIsShowPageLoader(false)
        }).catch((err) => {
            navigate(`/${lang}/404`)
        })

    }

    useEffect(() => {
        if(myOffers.some(offer => offer.task_id === task.id)) {
            setIsUserHasOfferForTask(true)
        }
        else {
            setIsUserHasOfferForTask(false)
        }

        if(myOffers.some(offer => offer.task_id === task.id && offer.status === 'accepted')) {
            setOfferStatus('accepted')
        }

        if(myOffers.some(offer => offer.task_id === task.id && offer.status === 'rejected')) {
            setOfferStatus('rejected')
        }
    }, [myOffers])

    useEffect(() => {
        fetchData()
    }, [id])

    const makeOffer = () => {
        api.post(`/api/user/task/${id}/offer`).then((res) => {
            setMyOffers(res.data.data.user_offers)
            dispatch(setHasNewTask(true))
        })
    }

    const cancelOffer = () => {
        let offer = myOffers.find(offer => offer.task_id === task.id)
        let offerId = offer.id
        api.delete(`/api/user/offer/remove/${offerId}`).then((res) => {
            if(res.data.success) {
                let offers = myOffers.filter(offer => offer.id !== offerId)
                setMyOffers(offers)
                dispatch(setHasNewTask(true))
            }
        })
    }

    const cancelTask = () => {
        handleShowTaskFinish()
    }
    const finishTask = () => {
        handleShowTaskFinish()
    }

    if(isShowPageLoader) {
        return <PageLoader />
    }
    else {
        if (task?.id) {
            return (
                <>
                    <Header />
                    <Wrapper>
                        <div className="container task-detail__container">
                            <div className="row">
                                <div className="col-7">
                                    <div className="task-detail__img">
                                        <img src={task.logo} alt=""/>
                                    </div>
                                </div>
                                <div className="col-5">
                                    <p className="h1 task-detail__title">{task.name}</p>
                                    <div>
                                        <div className="task-detail__category">{lang == 'ru' ? task.category : task.category_en}</div>
                                    </div>

                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 col-md-12 col-lg-7">
                                    <div className="task-detail__action">
                                        <div className="task-detail__author__panel">
                                            <Link to={`/${lang}/user/${task.user?.id}`} className="task-detail__author">
                                                <div className="task-detail__author-img">
                                                    {task.user?.avatar ?
                                                        <img src={task.user?.avatar} alt=""/>
                                                        :
                                                        <i className="icon icon-user-circle"></i>
                                                    }
                                                </div>
                                                <div className="task-detail__author-name">{task.user?.username}</div>
                                            </Link>
                                        </div>
                                        <div className="task-detail__btns">
                                            {
                                                (() => {
                                                    if (isAuth) {
                                                        // user
                                                        if (task.user?.id !== user.id) {

                                                            if (task.status === 'waiting') {
                                                                if (myOffers && isUserHasOfferForTask && offerStatus === 'accepted') {
                                                                    return <button className="btn btn-aqua-gradient" onClick={finishTask}>{ t('Complete') }</button>
                                                                } else if (myOffers && isUserHasOfferForTask && offerStatus === 'rejected') {
                                                                    return <p>{ t('You have been denied this assignment') }</p>
                                                                } else if (myOffers && isUserHasOfferForTask) {
                                                                    return <button className="btn btn-cancel" onClick={cancelOffer}>{ t('Cancel') }</button>
                                                                } else if (myOffers && !isUserHasOfferForTask) {
                                                                    return <button className="btn btn-aqua-gradient" onClick={makeOffer}>{ t('Select task') }</button>
                                                                }
                                                            }

                                                            if (task.status === 'in progress') {
                                                                if (myOffers && isUserHasOfferForTask && offerStatus === 'accepted') {
                                                                    return <button className="btn btn-aqua-gradient" onClick={finishTask}>{ t('Complete') }</button>
                                                                } else {
                                                                    return <p>{ t('Executor selected') }</p>
                                                                }
                                                            }

                                                            if (task.status === 'done') {
                                                                if (myOffers && isUserHasOfferForTask && offerStatus === 'accepted') {
                                                                    return <p>{ t('You have completed the task') }</p>
                                                                } else {
                                                                    return <p>{ t('Executor selected') }</p>
                                                                }
                                                            }

                                                            if (task.status === 'closed') {
                                                                return <div className="task-detail__btns">{ t('Task completed') }</div>
                                                            }
                                                        }
                                                        // author
                                                        else {
                                                            // if(task.status === 'waiting') {
                                                            //     return <button className="btn btn-aqua-gradient" onClick={finishTask}>Завершить</button>
                                                            // }
                                                            //
                                                            // if(task.status === 'in progress') {
                                                            //     return <button className="btn btn-aqua-gradient" onClick={finishTask}>Завершить</button>
                                                            // }

                                                            if (task.status === 'closed') {
                                                                return <div className="task-detail__btns">{ t('Task completed') }</div>
                                                            } else {
                                                                return <button className="btn btn-aqua-gradient" onClick={finishTask}>{ t('Complete') }</button>
                                                            }
                                                        }
                                                    }

                                                    //guest
                                                    else {
                                                        if (task.status === 'waiting') {
                                                            return <Link to={`/${lang}/task/${id}?show-login=open`} className="btn btn-aqua-gradient">{ t('Select task') }</Link>
                                                        }

                                                        if (task.status === 'in progress') {
                                                            return <p>{ t('Executor selected') }</p>
                                                        }
                                                        if (task.status === 'done') {
                                                            return <p>{ t('Executor selected') }</p>
                                                        }

                                                        if (task.status === 'closed') {
                                                            return <div className="task-detail__btns">{ t('Task completed') }</div>
                                                        }
                                                    }
                                                })()
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="task-detail__description">
                                        <p className="task-detail__description__title">{ t('Description') }</p>
                                        <p className="task-detail__description__text">{task.description}</p>
                                    </div>

                                </div>
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
export default Task
