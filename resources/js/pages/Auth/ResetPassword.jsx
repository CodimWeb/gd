import {useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Header from "../../components/Header/Header.jsx";
import Input from "../../components/ui/Input.jsx";
import api from "../../api";
import {setUser} from "../../store/slices/userSlice";

const ResetPassword = () => {
    const { lang } = useParams()
    const { t } = useTranslation()

    const isAuth = !!localStorage.getItem('accessToken')

    if(isAuth) {
        return <Navigate to={`/${lang}/`} />
    }

    const [isSendMail, setIsSendMail] = useState(false)
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('')

    const handleEmail = (value) => {
        setEmail(value)
        if(value === '') {
            setErrorEmail('Введите email')
        }
        else {
            let re = /\S+@\S+\.\S+/;
            if(!re.test(value)) {
                setErrorEmail('Введите корректный email')
            }
            else {
                setErrorEmail('')
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        api.post('/api/reset-password-request',{
            email: email,
        }).then((res) => {
            if(res.data.success) {
                setIsSendMail(true)
            }
            else {
                setIsSendMail(false)
            }
        }).catch(error => {

        })
    }

    return (
        <>
            {/*<Header />*/}

            <div className="container">
                <h2>{ t('Reset password') }</h2>
                {isSendMail ?
                    <div>
                        На вашу почту отправлено письмо
                    </div>
                    :
                    <form onSubmit={handleSubmit}>
                        <Input type="text" label="email" error={errorEmail} handleChange={handleEmail}/>
                        <button type="submit" className="btn btn-success">{t('Reset')}</button>
                    </form>
                }
            </div>
        </>
    )
}

export default ResetPassword
