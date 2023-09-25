import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Dropdown from "react-bootstrap/Dropdown";
import Header from "../../components/Header/Header.jsx";
import Wrapper from "../../components/Wrappwer/Wrapper";
import PageLoader from "../../components/Loader/PageLoader";
import api from "../../api";

const Home = () => {
    const { t, i18n } = useTranslation();
    const {lang} = useParams()

    const [categoriesWithTask, setCategoriesWithTask] = useState([])
    const [isShowPageLoader, setIsShowPageLoader] = useState(true)

    useEffect(() => {
        api.get('/api/task/categories').then((res) => {
            setCategoriesWithTask(res.data.data)
        }).finally(() => {
            setIsShowPageLoader(false)
        })
    }, [])


    return (
        <>
            {isShowPageLoader && <PageLoader />}
            <Header />
            <Wrapper>
                <div className="main-banner">
                    <div className="main-banner__content">
                        <h2 className="main-banner__title">{ t('Task search') }</h2>
                        <p className="h2 main-banner__subtitle">{ t('Pick a mission that\'s best for YOU!') }</p>
                        <div className="main-banner__category">
                            <Dropdown className="dropdown-category" key={lang}>
                                <Dropdown.Toggle>
                                    { t('Category') }
                                    <i className="icon icon-arrow-down"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {categoriesWithTask.map((category) => (
                                        <div className="dropdown-item" key={category.id}>
                                            <Link to={`/${lang}/category/${category.id}`} className="dropdown-category__link">
                                                {lang == 'ru' ? category.name : category.name_en}
                                            </Link>
                                        </div>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="main-banner__icon">
                            <i className="icon icon-mouse"></i>
                        </div>
                    </div>
                </div>
                <div className="main-banner__shadow"> </div>
                <div className="task-list">
                    <div className="container">
                        {categoriesWithTask.map((category) => (
                            <div key={category.id}>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="tasks-title">
                                            <p className="h1">{lang == 'ru' ? category.name : category.name_en}</p>
                                            <Link to={`/${lang}/category/${category.id}`} className="tasks-title__link tasks-title__link--desktop">{ t('See all') }</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="row task-list__group">
                                    {category.tasks.length > 0 ?
                                        (category.tasks.map((task) => (
                                            <div className="col-12 col-sm-6 col-md-6 col-xl-3" key={task.id}>
                                                <div className="task-item">
                                                    <Link to={`/${lang}/task/${task.id}`} className="task-item__image">
                                                        <img src={task.logo} alt=""/>
                                                    </Link>
                                                    <div className="task-item__detail">
                                                        {task.user?.avatar ?
                                                            <Link to={`/${lang}/user/${task.user_id}`} className="task-item__author">
                                                                <img src={task.user.avatar} alt=""/>
                                                            </Link>
                                                            :
                                                            <Link to={`/${lang}/user/${task.user_id}`} className="task-item__author-default">
                                                                <i className="icon icon-user-circle"></i>
                                                            </Link>
                                                        }

                                                        <div className="task-item__text">
                                                            <div className="task-item__label">{lang == 'ru' ? category.name : category.name_en}</div>
                                                            <Link to={`/${lang}/task/${task.id}`} className="task-item__name">{task.name}</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )))
                                        :
                                        <div className="col-12">{ t('No tasks') }</div>
                                    }
                                    <div className="col-12">
                                        <div className="tasks-show-all-mobile">
                                            <Link to={`/${lang}/category/${category.id}`} className="tasks-title__link tasks-title__link--mobile">{ t('See all') }</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        )}
                    </div>
                </div>
            </Wrapper>
        </>
    )
}

export default Home
