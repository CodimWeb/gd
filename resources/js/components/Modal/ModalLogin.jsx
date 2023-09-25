import {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import api from "../../api";
import {setUser} from "../../store/slices/userSlice";
import Input from "../ui/Input";
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";

const ModalLogin = ({show, handleShowLogin, handleCloseLogin, handleShowRegistration, handleShowForgotPassword}) => {
    const { lang } = useParams()
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorCredentials, setErrorCredentials] = useState(false)

    const [successEmail, setSuccessEmail] = useState(false)
    const [successPassword, setSuccessPassword] = useState(false)

    useEffect(() => {
        if(show == false ) {
            setEmail('');
            setPassword('');

            setErrorEmail('')
            setErrorPassword('')

            setSuccessEmail(false)
            setSuccessPassword(false)
            setErrorCredentials(false)
        }
    }, [show])


    const switchToRegistration = () => {
        handleCloseLogin()
        handleShowRegistration()
    }

    const switchToForgotPassword = () => {
        handleCloseLogin()
        handleShowForgotPassword()
    }

    const handleEmail = (value) => {
        setEmail(value)
        if(value === '') {
            setErrorEmail('Enter email')
            setSuccessEmail(false)
        }
        else {
            let re = /\S+@\S+\.\S+/;
            if(!re.test(value)) {
                setErrorEmail('Enter valid email')
                setSuccessEmail(false)
            }
            else {
                setErrorEmail('')
                setSuccessEmail(true)
            }
        }
    }

    const handlePassword = (value) => {
        setPassword(value)
        if(value.length < 6) {
            setErrorPassword('Password must contain at least 6 characters')
            setSuccessPassword(false)
        }
        else {
            setErrorPassword('')
            setSuccessPassword(true)
        }
    }

    const validate = (form) => {
        let isValidEmail = true;
        let isValidPassword = true;

        if(email === '') {
            setErrorEmail('Enter email')
            isValidEmail = false;
        }
        else {
            let re = /\S+@\S+\.\S+/;
            if(!re.test(email)) {
                setErrorEmail('Enter valid email')
                isValidEmail = false;
            }
        }

        if(password.length < 6) {
            setErrorPassword('Password must contain at least 6 characters')
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
                // navigate(`/${lang}/`);
            }).catch(error => {
                setErrorCredentials(true)
            })
        }
    }

    return (
        <Modal centered className="modal-login" show={show} onHide={handleCloseLogin}>
            <Modal.Header>
                <button className='modal-close' onClick={handleCloseLogin}>
                    <i className="icon icon-close"></i>
                </button>
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body__content">
                    <p className="h1 modal-title">{ t('Enter') }</p>
                    <p className="modal-subtitle">{ t('Don\'t have an account?') } <span className="color-aqua modal-switch" onClick={switchToRegistration}>{ t('Registration') }</span></p>
                    <form className="form-login" onSubmit={handleSubmit}>
                        <div style={{display: 'none'}}>
                            <label htmlFor="email">email</label>
                            <input type="email" name="email" id="email"/>
                            <label htmlFor="password">password</label>
                            <input type="password" name="password" id="password"/>
                        </div>
                        {errorCredentials && <div className="login-error">{ t('Incorrect email or password') }</div>}
                        <Input type="text" name="email" label="Email" error={errorEmail} success={successEmail} handleChange={ handleEmail } />
                        <Input type="password" name="password" label="Password" error={errorPassword} success={successPassword} handleChange={ handlePassword } />
                        <button type="submit" className="btn btn-aqua-gradient btn-block">{ t('Log in') }</button>
                        <p className="modal-login__forgot color-aqua" onClick={switchToForgotPassword}>{ t('Forgot your password') }</p>
                    </form>
                </div>
            </Modal.Body>
        </Modal>

    )
}

export default ModalLogin
