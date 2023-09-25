import {useState} from "react";
import {useTranslation} from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Input from "../ui/Input";
import api from "../../api";

import Success from '../../../img/success.svg'

const ModalForgotPassword = ({showForgotPassword, handleCloseForgotPassword, handleShowForgotPassword}) => {

    const { t } = useTranslation()

    const [isSendMail, setIsSendMail] = useState(false)
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('')
    const [successEmail, setSuccessEmail] = useState(false)

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

    const handleSubmit = (e) => {
        e.preventDefault()
        api.post('/api/reset-password-request',{
            email: email,
        }).then((res) => {
            if(res.data.success) {
                setIsSendMail(true)
            }
        }).catch(error => {

        })
    }

    return (
        <Modal centered className="modal-forgot-password" show={showForgotPassword} onHide={handleCloseForgotPassword}>
            <Modal.Header>
                <button className='modal-close' onClick={handleCloseForgotPassword}>
                    <i className="icon icon-close"></i>
                </button>
            </Modal.Header>
            <Modal.Body>
                {!isSendMail &&
                    <div className="modal-body__content">
                        <p className="h1 modal-title">{ t('Forgot your password') }?</p>
                        <p className="modal-subtitle">{ t('Enter your account email address and we\'ll send you a password reset link') }.</p>
                        <form className="form-login" onSubmit={handleSubmit} autoComplete="off">
                            <Input type="text" label="Email" error={errorEmail} success={successEmail} handleChange={ handleEmail } />
                            <button type="submit" className="btn btn-aqua-gradient btn-block">{ t('Send link') }</button>
                        </form>
                    </div>
                }
                {isSendMail &&
                    <div className="modal-body__content">
                        <div className="modal-success">
                            <img src={Success} alt=""/>
                        </div>
                        <p className="h1 modal-title">{ t('Letter sent') }</p>
                        <p className="modal-subtitle">{ t('An email has been sent to your email address with a link to reset your password') }</p>
                        <div className="modal-btn-container">
                            <button onClick={handleCloseForgotPassword} className="btn btn-aqua-gradient btn-block">{ t('Ok') }</button>
                        </div>
                    </div>
                }
            </Modal.Body>
        </Modal>

    )
}

export default ModalForgotPassword
