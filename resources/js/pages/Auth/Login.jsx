import {useState} from "react";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";

import Header from "../../components/Header/Header.jsx";
import Input from "../../components/ui/Input.jsx";
import api from "../../api";
import { setUser } from "../../store/slices/userSlice";

const Login = () => {

    const { lang } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const isAuth = !!localStorage.getItem('accessToken')

    if(isAuth) {
        return <Navigate to={`/${lang}/`} />
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorCredentials, setErrorCredentials] = useState(false)



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

    const handlePassword = (value) => {
        setPassword(value)
        if(value.length < 6) {
            setErrorPassword('Пароль должен содержать не менее 6 символов')
        }
        else {
            setErrorPassword('')
        }
    }

    const validate = (form) => {
        let isValidEmail = true;
        let isValidPassword = true;

        console.log(email)
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

        if(password.length < 6) {
            setErrorPassword('Пароль должен содержать не менее 6 символов')
            isValidPassword = false;
        }

        return isValidEmail && isValidPassword
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(validate(e.target)) {
            api.post('/api/auth/login',{
                email: email,
                password: password,
            }).then((res) => {
                dispatch(setUser(res.data.user))
                localStorage.setItem('accessToken', res.data.token)
                navigate(`/${lang}/`);
            }).catch(error => {
                setErrorCredentials(true)
            })
        }
    }

    return (
        <>
            <Header />
            <div className="container">
                <h2>{ t('Sign in') }</h2>
                { errorCredentials && <p className="text-danger">{ t('Invalid login or password') }</p>}
                <form onSubmit={handleSubmit} autoComplete="off">
                    <Input type="text" label="email" error={errorEmail} handleChange={ handleEmail } />
                    <Input type="password" label="password" error={errorPassword} handleChange={ handlePassword } />
                    <button type="submit" className="btn btn-success">{ t('Sign in') }</button>
                    <Link to={`/${lang}/password-reset`} className="btn btn-link">{ t('Forgot password') }</Link>
                </form>
            </div>
        </>
    )
}

export default Login
