import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import api from "../../api";
import {useParams} from "react-router-dom";

import Wrapper from "../../components/Wrappwer/Wrapper";
import Header from "../../components/Header/Header";
import Page404 from "../Page404/Page404";
import PageLoader from "../../components/Loader/PageLoader";
import {useTranslation} from "react-i18next";

const UserDetail = () => {
    const { t } = useTranslation()
    const {lang, id} = useParams()
    const [user, serUser] = useState({})
    const [isShowPageLoader, setIsShowPageLoader] = useState(true)

    useEffect(() => {
        api.get(`/api/user/${id}`).then((res) => {
            serUser(res.data.data)
            setIsShowPageLoader(false)
        })
    }, [])

    const getAge = (dateString) => {
        let today = new Date();
        let birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    const ageToString = (age) => {
        let txt;
        let count = age % 100;

        if (count >= 5 && count <= 20) {
            txt = 'лет';
        } else {
            count = count % 10;
            if (count == 1) {
                txt = 'год';
            } else if (count >= 2 && count <= 4) {
                txt = 'года';
            } else {
                txt = 'лет';
            }
        }
        if(lang === 'ru') {
            return age+" "+txt;
        }

        else {
            return `${age} years`
        }

    }

    if(isShowPageLoader) {
        return <PageLoader />
    }
    else {
        if (user) {
            return (
                <>
                    <Header/>
                    <Wrapper>
                        <div className="user-detail__wrapper">
                            {user?.email &&
                            <>
                                <div className="user-info">
                                    <div className="user-info__avatar">
                                        {user.avatar ?
                                            <img src={user.avatar} />
                                            :
                                            <i className="icon icon-user-circle"></i>
                                        }
                                    </div>
                                    <div className="user-info__user-name">{user.username}</div>
                                    <div className="user-info__item">
                                        <div className="h3 user-info__item__label">{ t('Age') }</div>
                                        <div className="h3 user-info__item__value">
                                            {ageToString(getAge(user.birthday))}
                                        </div>
                                    </div>
                                    <div className="user-info__item">
                                        <div className="h3 user-info__item__label">{ t('Country') }</div>
                                        <div
                                            className="h3 user-info__item__value">{lang === 'en' ? user.country_en : user.country_ru}</div>
                                    </div>
                                    <div className="user-info__item">
                                        <div className="h3 user-info__item__label">{ t('Biography') }</div>
                                        <div
                                            className="h3 user-info__item__value user-info__item__value--biography">{user.biography ? user.biography : ''}</div>
                                    </div>
                                </div>
                                <div className="user-statistics">
                                    <div className="user-info__item">
                                        <div className="h3 user-info__item__label">{ t('Completed tasks') }:</div>
                                        <div className="h3 user-info__item__value">{user.done_tasks}</div>
                                    </div>
                                    <div className="user-info__item">
                                        <div className="h3 user-info__item__label">{ t('Created jobs') }:</div>
                                        <div className="h3 user-info__item__value">{user.created_tasks}</div>
                                    </div>
                                </div>
                            </>
                            }
                        </div>
                    </Wrapper>
                </>
            )
        }
        else {
            return <Page404/>
        }
    }
}

export default UserDetail
