import {Navigate, useParams} from 'react-router-dom';

const AuthGuard = ({children}) => {
    const { lang } = useParams()
    const isAuth = !!localStorage.getItem('accessToken')

    if(!isAuth) {
        return <Navigate to={`/${lang}/?show-login=open`} />
    }

    return children
}

export default AuthGuard
