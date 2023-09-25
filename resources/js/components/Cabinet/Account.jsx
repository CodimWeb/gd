import Input from "../ui/Input";
import {useSelector} from "react-redux";
import api from "../../api";
import {setUser} from "../../store/slices/userSlice";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const Account = ({ toggleNav }) => {
    const { t } = useTranslation()
    const user = useSelector(state => state.user.user)
    const [email, setEmail] = useState('');

    useEffect(() => {
        setEmail(user.email)
    }, [user])

    return (
        <div className="cabinet-wrapper">
            <p className="h1 cabinet__title">
                <i className="icon icon-arrow-down-long" onClick={toggleNav}></i>
                { t('My account') }
            </p>
            <Input type="text" label="Email" value={email || ''} readonly={true} className={'color-white text-lg'} handleChange={ () => {return false} }/>
        </div>
    )
}

export default Account
