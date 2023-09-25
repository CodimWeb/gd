import {Link, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {clearTask} from "../../store/slices/createTaskSlice";

const CreateTaskSuccess = () => {
    const { lang } = useParams()
    const createdTaskId = useSelector(state => state.createTask.task.createdTaskId)
    const dispatch = useDispatch()
    const clearTaskSlice = () => {
        dispatch(clearTask())
    }

    return (
        <>
            <div>Задание успешно создано</div>
            <Link to={`/${lang}/task/${createdTaskId}`} onClick={clearTaskSlice}>Перейти к задаче</Link>
            <Link to={`/${lang}/`} onClick={clearTaskSlice}>На главную</Link>
        </>
    )
}

export default CreateTaskSuccess
