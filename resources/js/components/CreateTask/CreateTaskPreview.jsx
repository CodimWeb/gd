import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {clearTask, setCreatedTaskId, setStep} from "../../store/slices/createTaskSlice";
import {toast} from "react-toastify";
import ToastMessage from "../Toast/ToastMessage";
import PageLoader from "../Loader/PageLoader";
import api from "../../api";
import {useTranslation} from "react-i18next";

const CreateTaskPreview = () => {
    const { t } = useTranslation()
    const { lang } = useParams()
    const task = useSelector(state => state.createTask.task)
    const step = useSelector(state => state.createTask.step)
    const [isShowPageLoader, setIsShowPageLoader] = useState(false)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const saveTask = () => {
        setIsShowPageLoader(true)
        api.post('/api/task', {
            category_id: task.category.value,
            name: task.title,
            description: task.description,
            logo: task.photoBase64
        }).then((res) => {
            if(res.data.success ) {
                navigate(`/${lang}/task/${res.data.data.id}`)
                dispatch(clearTask())
            }
            else {
                setIsShowPageLoader(false)
                toast(<ToastMessage type='error' title="Error" message="Limit is exceeded"/>)

            }
        }).catch(error => {
            setIsShowPageLoader(false)
        })
    }

    return (
        <>
            {isShowPageLoader && <PageLoader />}
            <div className="create-task__preview">
                <p className="h1 create-task__title">{ t('PREVIEW') }</p>

                <div className="task-detail__img">
                    <img src={task.photoBase64} alt=""/>
                </div>
                <div className="careate-task__preview__title__panel">
                    <p className="h2 careate-task__preview__title">{task.title}</p>
                    <div>
                        <div className="task-detail__category">{task.category.label}</div>
                    </div>
                </div>
                <div className="task-detail__description">
                    <p className="task-detail__description__title">{ t('Description') }</p>
                    <p className="task-detail__description__text">{task.description}</p>
                </div>
                <div className="create-task__preview__btns">
                    <button type="button" className="btn btn-aqua-gradient-ghost" onClick={() => {dispatch(setStep(1))}}>{ t('Back') }</button>
                    <button type="button" className="btn btn-aqua-gradient" onClick={saveTask}>{ t('Publish') }</button>
                </div>
            </div>
        </>
    )
}

export default CreateTaskPreview
