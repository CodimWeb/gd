import { useState } from "react";
import { useTranslation } from "react-i18next";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import Header from "../../components/Header/Header";
import Input from "../../components/ui/Input";
import api from "../../api";
import {setUser} from "../../store/slices/userSlice";

const Registration = () => {

    const { lang } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate();

    const isAuth = !!localStorage.getItem('accessToken')

    if(isAuth) {
        return <Navigate to={`/${lang}/`} />
    }

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorLogin, setErrorLogin] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorBirthday, setErrorBirthday] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('')


    const handleLogin = (value) => {
        setLogin(value)
        if(value === '') {
            setErrorLogin('Введите логин')
        }
        else if(value.length < 3) {
            setErrorLogin('Введите логин')
        } else {
            setErrorLogin('')
        }
    }

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

    const handleBirthday = (value) => {
        setBirthday(value)
        if(value === '') {
            setErrorBirthday('Введите дату рождения')
        }
        else
        setErrorBirthday('')
    }

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

    const validate = (form) => {
        let isValidLogin = true;
        let isValidEmail = true;
        let isValidBirthday = true;
        let isValidPassword = true;
        let isValidPasswordConfirm = true;

        if(login === '' || login.length < 3) {
            setErrorLogin('Введите логин')
            isValidLogin = false;
        }

        if(email === '') {
            setErrorEmail('Введите email')
            isValidEmail = false;
        }
        else {
            let re = /\S+@\S+\.\S+/;
            if(!re.test(email)) {
                setErrorEmail('Введите корректный email')
                isValidEmail = false;
            }
        }

        if(birthday === '') {
            setErrorBirthday('Введите дату рождения')
            isValidBirthday = false;
        }


        if(password.length < 6) {
            setErrorPassword('Пароль должен содержать не менее 6 символов')
            isValidPassword = false;
        }

        if(passwordConfirm !== password || passwordConfirm === '' ) {
            setErrorPasswordConfirm('Пароль должен совпадать')
            isValidPasswordConfirm = false;
        }

        return isValidLogin && isValidEmail &&  isValidBirthday && isValidPassword && isValidPasswordConfirm
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(validate(e.target)) {
            api.post('/api/auth/register',{
                username: login,
                email: email,
                birthday: birthday,
                password: password,
                password_confirmation: passwordConfirm,
            }).then((res) => {
                dispatch(setUser(res.data.user))
                localStorage.setItem('accessToken', res.data.token)
                navigate(`/${lang}/`);
                // navigate(`/${lang}/login`);
                console.log(res)
            }).catch(error => {
                console.log(error)
                if(error.response.data.data.email[0] === 'The email has already been taken.') {
                    setErrorEmail('The email has already been taken.')
                }
            })
        }
    }

    return (
        <>
            <Header />
            <div className="container">
                <h2>{ t('Sign up') }</h2>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <Input type="text" label="login" error={errorLogin} handleChange={ handleLogin } />
                    <Input type="text" label="email" error={errorEmail} handleChange={ handleEmail } />
                    <Input type="date" label="birthday" error={errorBirthday} handleChange={ handleBirthday } />
                    <Input type="password" label="password" error={errorPassword} handleChange={ handlePassword } />
                    <Input type="password" label="password confirm" error={errorPasswordConfirm} handleChange={ handlePasswordConfirm } />
                    <button type="submit" className="btn btn-success">{ t('Sign up') }</button>
                </form>
            </div>
        </>
    )
}

export default Registration
