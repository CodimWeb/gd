import Modal from "react-bootstrap/Modal";
import Success from '../../../img/success.svg'
import {useTranslation} from "react-i18next";

const ModalRegistrationFinish = ({showRegistrationFinish, handleShowRegistrationFinish, handleCloseRegistrationFinish }) => {

    const { t } = useTranslation()

    return (
        <Modal centered className="modal-registration-finish" show={showRegistrationFinish} onHide={handleCloseRegistrationFinish}>
            <Modal.Header>
                {/*<button className='modal-close' onClick={handleCloseRegistrationFinish}>*/}
                {/*    <i className="icon icon-close"></i>*/}
                {/*</button>*/}
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body__content">
                    <div className="modal-success">
                        <img src={Success} alt=""/>
                    </div>
                    <p className="h1 modal-title">{ t('Registration completed') }!</p>
                    <p className="modal-subtitle">{ t('We have sent you an email to confirm your registration') }.</p>
                    <div className="modal-btn-container">
                        <button onClick={handleCloseRegistrationFinish} className="btn btn-aqua-gradient btn-block">{ t('Ok') }</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    )
}

export default ModalRegistrationFinish
