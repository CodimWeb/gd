import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import Header from "../../components/Header/Header";
import Wrapper from "../../components/Wrappwer/Wrapper";
import CreateTaskForm from "../../components/CreateTask/CreateTaskForm";
import CreateTaskPreview from "../../components/CreateTask/CreateTaskPreview";
import CreateTaskSuccess from "../../components/CreateTask/CreateTaskSuccess";
import { clearTask } from "../../store/slices/createTaskSlice";

const CreateTask = () => {
    const { lang } = useParams()
    const dispatch = useDispatch()
    const step = useSelector(state => state.createTask.step)

    useEffect(() => {
        return () => {
            dispatch(clearTask())
        }
    }, [])

    return (
        <>
            <Header />
            <Wrapper>
                <div className="create-task__wrapper">
                    <div className="create-task__content">
                        {step === 1 && <CreateTaskForm />}
                        {step === 2 && <CreateTaskPreview />}
                        {step === 3 && <CreateTaskSuccess />}
                    </div>
                </div>
            </Wrapper>

        </>

    )
}

export default CreateTask
