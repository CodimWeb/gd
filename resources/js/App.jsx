import {lazy, Suspense} from "react";
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './i18n';
import { Provider } from 'react-redux';
import store from './store'
import Home from "./pages/Home/Home";
import ModalCookie from "./components/Modal/ModalCookie";
import AuthGuard from "./components/Auth/AuthGuard";
import PageLoader from "./components/Loader/PageLoader";

// const Registration = lazy(() => import('./pages/Auth/Registration'));
// const Login = lazy(() => import('./pages/Auth/Login'));
// const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
// const NewPassword = lazy(() => import('./pages/Auth/NewPassword'));
const Profile = lazy(() => import('./pages/Cabinet/Cabinet'));
const UserDetail = lazy(() => import('./pages/UserDetail/UserDetail'))
const CreateTask = lazy(() => import('./pages/CreateTask/CreateTask'))
const Task = lazy(() => import('./pages/Task/Task'))
const Category = lazy(() => import('./pages/Category/Category'))
const Chat = lazy(() => import('./pages/Chat/Chat'))
const Error = lazy(() => import('./pages/Page404/Page404'))

const App = () => {
    const { t, i18n } = useTranslation();
    const acceptCookie = localStorage.getItem('acceptCookie') || false
    return (
        <>
            <Suspense fallback={<PageLoader />}>
                <Provider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route path=':lang/'>
                                <Route index element={<Home />}/>
                                <Route path='reset-password/:hash' element={<Home />} />
                                <Route path='cabinet/:tab?' element={<AuthGuard><Profile /></AuthGuard>} />
                                <Route path='user/:id' element={<UserDetail />} />
                                <Route path={'create-task'} element={<AuthGuard><CreateTask /></AuthGuard>} />
                                <Route path={'category/:id'} element={<Category />} />
                                <Route path={'task/:id'} element={<Task />} key={location.pathname}/>
                                <Route path={'task/:id/chat/'} element={<AuthGuard><Chat /></AuthGuard>} />

                                <Route path={'*'} element={<Error/>} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </Provider>
            </Suspense>
            { !acceptCookie &&
                <ModalCookie />
            }
        </>
    );
}

export default App;
