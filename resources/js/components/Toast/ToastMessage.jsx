import {useTranslation} from "react-i18next";

const ToastMessage = ({ closeToast, toastProps, type, title, message }) => {

    const { t } = useTranslation()

    return (
        <div className={`toast__body ${type}`}>
            <div className="toast__icon">
                <div className={`toast__icon__container ${type}`}>
                    {type === 'success' && <i className="icon icon-done"></i>}
                    {type === 'error' && <i className="icon icon-warning"></i>}

                </div>
            </div>
            <div className="toast__message">
                <div className="h3 toast__message-title">{ t(title) }!</div>
                <div className="toast__message__text">{ t(message) }</div>
            </div>
            <i className="icon icon-close toast__close" onClick={closeToast}></i>
        </div>
    )
}

export default ToastMessage
