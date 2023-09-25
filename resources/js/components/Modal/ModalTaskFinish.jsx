import Modal from "react-bootstrap/Modal";
import {useNavigate, useParams} from "react-router-dom";
import api from "../../api";
import {memo} from "react";
import {useTranslation} from "react-i18next";

const ModalTaskFinish = ({task, updateTask, isAuthor, showTaskFinish, handleShowTaskFinish, handleCloseTaskFinish }) => {

    const { t } = useTranslation()
    const { lang } = useParams()
    const navigate = useNavigate()
    const finishedTask = () => {
        api.post(`/api/task/${task.id}/close`).then((res) => {

            if(isAuthor) {
                navigate(`/${lang}/`)
            }
            else {
                let cloneTask = JSON.parse(JSON.stringify(task))
                cloneTask.status = 'done'
                updateTask(cloneTask);
                handleCloseTaskFinish()
            }


        })
    }

    return (
        <Modal centered className="modal-task-finish" show={showTaskFinish} onHide={handleCloseTaskFinish} backdrop="static">
            <Modal.Header>
                {/*<button className='modal-close' onClick={handleCloseRegistrationFinish}>*/}
                {/*    <i className="icon icon-close"></i>*/}
                {/*</button>*/}
            </Modal.Header>
            <Modal.Body>
                <div className="modal-body__content">
                    <p className="h1 modal-title">{ t('Complete task') }?</p>
                    <div className="modal-btn-container">
                        <div className="modal-btn-container__item">
                            <button onClick={finishedTask} className="btn btn-aqua-gradient btn-block">{ t('Yes') }</button>
                        </div>
                        <div className="modal-btn-container__item">
                            <button onClick={handleCloseTaskFinish} className="btn btn-aqua-gradient-ghost btn-block">{ t('No') }</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    )
}

export default memo(ModalTaskFinish)
