import {useParams, useNavigate, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Input from "../../components/ui/Input.jsx";
import api from "../../api";
import {useState} from "react";

const NewPassword = () => {
    const { lang, hash } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams()
    const email = searchParams.get('email')

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorPassword, setErrorPassword] = useState('')
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('')
    const [errorChangePassword, setErrorChangePassword] = useState('')

    const handlePassword = (value) => {
        setPassword(value)
        if(value.length < 6) {
            setErrorPassword('Пароль должен содержать не менее 6 символов')
        }
        else {
            setErrorPassword('')
        }
    }

    const handlePasswordConfirm = (value) => {
        setPasswordConfirm(value)
        if(value !== password || value === '' ) {
            setErrorPasswordConfirm('Пароль должен совпадать')
        }
        else {
            setErrorPasswordConfirm('')
        }
    }

    const validate = () => {
        let isValidPassword = true;
        let isValidPasswordConfirm = true;

        if(password.length < 6) {
            setErrorPassword('Пароль должен содержать не менее 6 символов')
            isValidPassword = false;
        }

        if(passwordConfirm !== password || passwordConfirm === '' ) {
            setErrorPasswordConfirm('Пароль должен совпадать')
            isValidPasswordConfirm = false;
        }

        return isValidPassword && isValidPasswordConfirm
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(validate(e.target)) {
            api.post('/api/reset-password',{
                token: hash,
                email: email,
                password: password,
                password_confirmation: passwordConfirm,
            }).then((res) => {
                console.log(res)
                navigate(`/${lang}/login`);
            }).catch(error => {
                setErrorChangePassword(error.response.data.data)
                console.log(error)
            })
        }
    }

    return (
        <div className="container">
            <h2>{ t('Enter new password') }</h2>
            { errorChangePassword && <p className="text-danger">{ t('This password reset token is invalid.') }</p>}
            <form onSubmit={handleSubmit} autoComplete="off">
                <Input type="password" label="password" error={errorPassword} handleChange={ handlePassword } />
                <Input type="password" label="password confirm" error={errorPasswordConfirm} handleChange={ handlePasswordConfirm } />
                <button type="submit" className="btn btn-success">{ t('Save password') }</button>
            </form>
        </div>
    )
}

export default NewPassword
