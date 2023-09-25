import {useEffect, useState} from "react";
import {Link, useParams, useSearchParams} from "react-router-dom";
import Header from "../../components/Header/Header";
import Wrapper from "../../components/Wrappwer/Wrapper";
import Page404 from "../Page404/Page404";
import PageLoader from "../../components/Loader/PageLoader";
import api from "../../api";

const Category = () => {

    const [searchParams] = useSearchParams();

    const page = searchParams.get('page') ? searchParams.get('page') : 1

    const {lang, id} = useParams()
    const [tasks, setTasks] = useState(null)
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState({})
    const [pages, setPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(page)
    const [isShowPageLoader, setIsShowPageLoader] = useState(true)

    useEffect(() => {
        // setIsShowPageLoader(true)
        api.get(`/api/categories`).then((res) => {
            let categories = res.data.data
            let category = categories.find(category => category.id == id)
            setCategory(category)
            setCategories(res.data.data)
        })

    }, [])

    useEffect(() => {

        const fetchPage = searchParams.get('page') ? searchParams.get('page') : 1
        setIsShowPageLoader(true)
        api.get(`/api/task/list/${id}/?page=${fetchPage}`).then((res) => {
            setTasks(res.data.data.data)
            setPages(res.data.data.meta.last_page)
            setCurrentPage(fetchPage)

        }).finally(() => {
            setIsShowPageLoader(false)
        })
    }, [page])

    if(isShowPageLoader) {
        return <PageLoader />
    }

    else {
        if (tasks && searchParams.get('page') <= pages) {
            return (
                <>
                    {isShowPageLoader && <PageLoader/>}
                    <Header/>
                    <Wrapper>
                        <div className="container">
                            <h1 className="category__title">{category?.name}</h1>
                            <div className="row task-list__group">
                                {
                                    tasks?.map((task) => (
                                        <div className="col-12 col-sm-6 col-md-6 col-xl-3" key={task.id}>
                                            <div className="task-item">
                                                <Link to={`/${lang}/task/${task.id}`} className="task-item__image">
                                                    <img src={task.logo} alt=""/>
                                                </Link>
                                                <div className="task-item__detail">
                                                    {task.user?.avatar ?
                                                        <Link to={`/${lang}/user/${task.user_id}`}
                                                              className="task-item__author">
                                                            <img src={task.user.avatar} alt=""/>
                                                        </Link>
                                                        :
                                                        <Link to={`/${lang}/user/${task.user_id}`}
                                                              className="task-item__author-default">
                                                            <i className="icon icon-user-circle"></i>
                                                        </Link>
                                                    }

                                                    <div className="task-item__text">
                                                        <div className="task-item__label">{category.name}</div>
                                                        <Link to={`/${lang}/task/${task.id}`}
                                                              className="task-item__name">{task.name}</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            {pages > 1 &&
                                <ul className="paggination">
                                    {
                                        (() => {
                                            let links = []
                                            for (let i = 1; i <= pages; i++) {
                                                links.push(
                                                    <li key={i}>
                                                        <Link
                                                            to={`/${lang}/category/${id}?page=${i}`}
                                                            className={`${i == currentPage ? 'active' : ''}`}
                                                            onClick={() => {
                                                                setCurrentPage(i)
                                                            }}
                                                        >{i}</Link>
                                                    </li>
                                                )
                                            }
                                            return links
                                        })()
                                    }
                                </ul>
                            }
                        </div>
                    </Wrapper>
                </>

            )
        } else {
            return (
                <>
                    <Page404/>
                </>
            )
        }
    }
}



export default Category
