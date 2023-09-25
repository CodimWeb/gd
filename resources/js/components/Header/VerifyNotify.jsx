import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

import Modal from "react-bootstrap/Modal";

import api from "../../api";

const VerifyNotify = () => {

    const { t } = useTranslation();
    const user = useSelector(state => state.user.user)

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    useEffect(() => {
        if(!localStorage.getItem('userNotifiedVerify')) {
            setShow(true)
        }
    }, [])

    const closeModal = () => {
        handleClose()
        localStorage.setItem('userNotifiedVerify', 'true')
    }


    const sendVerification = () => {
        api.post('/api/user/email-verify').then((res) => {

        }).catch(error => {

        }).finally(() => {
            closeModal()
        })
    }

    return(
        <>
            <div className="verify-notify" onClick={handleShow}>
                <i className="icon icon-warning"></i>
                <p>{ t('This is an unverified account. Some features will be restricted.') } <span>{t('Verify account')}</span>.</p>
            </div>
            <Modal centered className="modal-verify" show={show} onHide={closeModal}>
                <Modal.Header>
                    <button className='modal-close' onClick={closeModal}>
                        <i className="icon icon-close"></i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-body__content">
                        <p className="h1 modal-title">подтвердить <br/> учетную запись</p>
                        <p className="modal-subtitle">
                            Проверьте свою электронную почту <span className="color-aqua">({user?.email})</span> и
                            следуйте инструкциям, чтобы подтвердить свою учетную запись.
                        </p>
                        <p className="modal-verify-message">Если вы не получили электронное письмо или срок его действия истек, вы можете отправить его повторно</p>
                        <div className="modal-btn-container modal-btn-container--verify">
                            <button onClick={sendVerification} className="btn btn-aqua-gradient btn-block">Отправить письмо еще раз</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>

    )
}

export default VerifyNotify
