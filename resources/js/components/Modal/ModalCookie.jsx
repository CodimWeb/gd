import Modal from "react-bootstrap/Modal";
import Cookie from '../../../img/cookie.png'
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const ModalCookie = () => {
    const { t } = useTranslation()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const applyCookie = () => {
        localStorage.setItem('acceptCookie', 'true')
        handleClose()
    }

    useEffect(() => {
        if(!localStorage.getItem('acceptCookie')) {
            setShow(true)
        }
    }, [])

    return (
        <Modal centered className="modal-cookie" show={show} onHide={handleClose} backdrop="static">
            <Modal.Header>
                {/*<button className='modal-close' onClick={handleCloseRegistrationFinish}>*/}
                {/*    <i className="icon icon-close"></i>*/}
                {/*</button>*/}
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body__content">
                    <div className="modal-success">
                        <img src={Cookie} alt=""/>
                    </div>
                    <p className="modal-subtitle">{ t('Cookie message') }&nbsp;
                        <a href="#" className="modal-cookie__link">{ t('Cookie Policy') }.</a>
                    </p>
                    <div className="modal-btn-container">
                        <button onClick={applyCookie} className="btn btn-aqua-gradient btn-block">{ t('Accept Cookies') }</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    )
}

export default ModalCookie
