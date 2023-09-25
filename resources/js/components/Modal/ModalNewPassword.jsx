import {useState} from "react";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Input from "../ui/Input";

import api from "../../api";
import Success from '../../../img/success.svg'

const ModalNewPassword = ({showNewPassword, handleShowNewPassword, handleCloseNewPassword}) => {

    const { t } = useTranslation()
    const { lang, hash } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const email = searchParams.get('email')

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorPassword, setErrorPassword] = useState('')
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('')
    const [errorChangePassword, setErrorChangePassword] = useState('')
    const [successPassword, setSuccessPassword] = useState(false)
    const [successPasswordConfirm, setSuccessPasswordConfirm] = useState(false)
    const [isPasswordChanged, setIsPasswordChanged] = useState(false)

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

    const handlePasswordConfirm = (value) => {
        setPasswordConfirm(value)
        if(value !== password || value === '' ) {
            setErrorPasswordConfirm('Password must match')
            setSuccessPasswordConfirm(false)
        }
        else {
            setErrorPasswordConfirm('')
            setSuccessPasswordConfirm(true)
        }
    }

    const validate = () => {
        let isValidPassword = true;
        let isValidPasswordConfirm = true;

        if(password.length < 6) {
            setErrorPassword('Password must contain at least 6 characters')
            setSuccessPassword(false)
            isValidPassword = false;
        }

        if(passwordConfirm !== password || passwordConfirm === '' ) {
            setErrorPasswordConfirm('Password must match')
            setSuccessPasswordConfirm(false)
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
                setIsPasswordChanged(true)
            }).catch(error => {
                setErrorChangePassword(error.response.data.data)
            })
        }
    }

    return (
        <Modal centered className="modal-forgot-password" show={showNewPassword} onHide={handleCloseNewPassword}>
            <Modal.Header>
                {/*<button className='modal-close' onClick={handleCloseNewPassword}>*/}
                {/*    <i className="icon icon-close"></i>*/}
                {/*</button>*/}
            </Modal.Header>
            <Modal.Body>
                {isPasswordChanged &&
                    <div className="modal-body__content">
                        <div className="modal-success">
                            <img src={Success} alt=""/>
                        </div>
                        <p className="h1 modal-title">{ t('Password changed successfully') }!</p>
                        <div className="modal-btn-container">
                            <Link to={`/${lang}/`} onClick={handleCloseNewPassword} className="btn btn-aqua-gradient btn-block">{ t('Back to site') }</Link>
                        </div>
                    </div>
                }
                {!isPasswordChanged &&
                    <div className="modal-body__content">
                        <p className="h1 modal-title">{ t('Change password title') }</p>
                        {/*<p className="modal-subtitle">{ t('Enter your account email address and we\'ll send you a password reset link') }.</p>*/}
                        <form className="form-login" onSubmit={handleSubmit} autoComplete="off">
                            { errorChangePassword && <p className="text-danger">{ t('This password reset token is invalid.') }</p>}
                            <Input type="password" label="Password" success={successPassword} error={errorPassword} handleChange={ handlePassword } />
                            <Input type="password" label="Repeat password" success={successPasswordConfirm} error={errorPasswordConfirm} handleChange={ handlePasswordConfirm } />
                            <button type="submit" className="btn btn-aqua-gradient btn-block">{ t('Change password') }</button>
                        </form>
                    </div>
                }
            </Modal.Body>
        </Modal>

    )
}

export default ModalNewPassword
