import {useParams, NavLink} from "react-router-dom";
import {useTranslation} from "react-i18next";


import Wrapper from "../../components/Wrappwer/Wrapper";
import Header from "../../components/Header/Header";
import CabinetNav from "../../components/Cabinet/CabinetNav";
import Account from "../../components/Cabinet/Account";
import Profile from "../../components/Cabinet/Profile";
import ChangePassword from "../../components/Cabinet/ChangePassword";
import {useState} from "react";

const Cabinet = () => {
    const { lang, tab } = useParams()
    const { t } = useTranslation()
    const [isOpenNav, setIsOpenNav] = useState(false)

    const toggleNav = () => {
        setIsOpenNav(!isOpenNav)
    }

    return (
        <>
            <Header />
            <Wrapper className="no-bg">
                <div className="cabinet">
                    <div className="cabinet-content">
                        <CabinetNav isOpenNav={isOpenNav} toggleNav={toggleNav}/>
                        <div className="cabinet-section">
                            {tab === 'account' && <Account toggleNav={toggleNav}/>}

                            {tab === 'profile' && <Profile toggleNav={toggleNav}/>}

                            {tab === 'password' && <ChangePassword toggleNav={toggleNav}/>}
                        </div>
                    </div>
                </div>

            </Wrapper>
        </>
    )
}

export default Cabinet
