import {Link, useParams} from "react-router-dom";

import Header from "../../components/Header/Header";
import Game from '../../../img/game.png'
import Over from '../../../img/over.png'
import {useTranslation} from "react-i18next";

const Page404 = () => {
    const { t } = useTranslation()
    const {lang} = useParams()

    return (
        <>
            <Header />
            <div className="page-404">
                <div className="page-404__content">
                    <div className="page-404__img-container">
                        <img src={Game} alt="Game"/>
                        <img src={Over} alt="Over"/>
                    </div>
                    <div className="page-404__panel">
                        <p className="h1 page-404__title">{ t('Found everything but this page') }</p>
                        <Link to={`/${lang}/`} className="btn btn-aqua-gradient">{ t('Back to the main page') }</Link>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Page404
