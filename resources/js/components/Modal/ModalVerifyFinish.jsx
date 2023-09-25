import Modal from "react-bootstrap/Modal";
import Success from '../../../img/success.svg'
import {useTranslation} from "react-i18next";

const ModalRegistrationFinish = ({showVerifyFinish, handleShowVerifyFinish, handleCloseVerifyFinish }) => {

    const { t } = useTranslation()

    return (
        <Modal centered className="modal-registration-finish" show={showVerifyFinish} onHide={handleCloseVerifyFinish}>
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
                    <p className="h1 modal-title">{ t('Verification accepted') }!</p>
                    <p className="modal-subtitle">{ t('Your email has been successfully confirmed') }.</p>
                    <div className="modal-btn-container">
                        <button onClick={handleCloseVerifyFinish} className="btn btn-aqua-gradient btn-block">{ t('ok, got it') }</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    )
}

export default ModalRegistrationFinish
