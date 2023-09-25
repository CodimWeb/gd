import Modal from "react-bootstrap/Modal";
import {useEffect, useState} from "react";
import api from "../../api";
import {setUser} from "../../store/slices/userSlice";
import Input from "../ui/Input";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Select from 'react-select';
import {useDispatch} from "react-redux";
import PageLoader from "../Loader/PageLoader";

const ModalRegistration = ({show, handleShowRegistration, handleCloseRegistration, handleShowLogin, handleShowRegistrationFinish}) => {
    const { lang } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isShowPageLoader, setIsShowPageLoader] = useState(false)

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const [errorLogin, setErrorLogin] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorDay, setErrorDay] = useState('')
    const [errorMonth, setErrorMonth] = useState('')
    const [errorYear, setErrorYear] = useState('')
    const [errorPassword, setErrorPassword] = useState('')
    const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('')

    const [successLogin, setSuccessLogin] = useState(false)
    const [successEmail, setSuccessEmail] = useState(false)
    const [successDay, setSuccessDay] = useState(false)
    const [successMonth, setSuccessMonth] = useState(false)
    const [successYear, setSuccessYear] = useState(false)
    const [successPassword, setSuccessPassword] = useState(false)
    const [successPasswordConfirm, setSuccessPasswordConfirm] = useState(false)

    const [selectedYear, setSelectedYear] = useState(null);
    const optionsYear = [];
    const year = new Date().getFullYear()
    for(let i = year; i >= (year - 100); i-- ) {
        optionsYear.push({ value: i, label: i })
    }

    const optionsMonths = [
        { value: '01', label: 'January', days: 31 },
        { value: '02', label: 'February', days: 28 },
        { value: '03', label: 'March', days: 31 },
        { value: '04', label: 'April', days: 30 },
        { value: '05', label: 'May', days: 31 },
        { value: '06', label: 'June', days: 30},
        { value: '07', label: 'July', days: 31 },
        { value: '08', label: 'August', days: 31 },
        { value: '09', label: 'September', days: 30 },
        { value: '10', label: 'October', days: 31 },
        { value: '11', label: 'November', days: 30 },
        { value: '12', label: 'December', days: 31 },
    ]
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [daysInMonths, setDaysInMonths] = useState(31);

    useEffect(() => {
        if(show == false ) {
            setLogin('');
            setEmail('');
            setBirthday('');
            setPassword('');
            setPasswordConfirm('');
            setSelectedDay(null);
            setSelectedMonth(null);
            setSelectedYear(null);

            setErrorLogin('')
            setErrorEmail('')
            setErrorDay('')
            setErrorMonth('')
            setErrorYear('')
            setErrorPassword('')
            setErrorPasswordConfirm('')

            setSuccessLogin(false)
            setSuccessEmail(false)
            setSuccessDay(false)
            setSuccessMonth(false)
            setSuccessYear(false)
            setSuccessPassword(false)
            setSuccessPasswordConfirm(false)
        }
    }, [show])

    useEffect(() => {
        if(selectedMonth?.value === '02') {
            if(selectedDay?.value) {
                if(parseInt(selectedDay.value) > 28) {
                    setSelectedDay({ value: '28', label: '28' })
                }
            }
            if(selectedYear?.value % 4 === 0) {
                setDaysInMonths(29)
            }
        }
        else {
            if(selectedMonth?.days) {
                setDaysInMonths(selectedMonth.days)
            }
        }
    }, [selectedDay, selectedMonth, selectedYear])



    const optionsDays = []
    for(let i = 1; i <= daysInMonths; i++) {
        if(i < 10) {
            optionsDays.push({ value: `0${i}`, label: `0${i}` })
        }
        else {
            optionsDays.push({ value: `${i}`, label: `${i}` })
        }

    }

    const switchToLogin = () => {
        handleCloseRegistration()
        handleShowLogin()
    }

    const handleLogin = (value) => {
        setLogin(value)
        if(value === '') {
            setErrorLogin('Enter login')
            setSuccessLogin(false)
        }
        else if(value.length < 3) {
            setErrorLogin('Enter login')
            setSuccessLogin(false)
        } else {
            setSuccessLogin(true)
            setErrorLogin('')
        }
    }

    const handleEmail = (value) => {
        setEmail(value)
        if(value === '') {
            setErrorEmail('Enter email')
            setSuccessEmail(false)
        }
        else {
            let re = /\S+@\S+\.\S+/;
            if(!re.test(value)) {
                setErrorEmail('Enter valid email')
                setSuccessEmail(false)
            }
            else {
                setErrorEmail('')
                setSuccessEmail(true)
            }
        }
    }

    const handleSelectedDay = (value) => {
        setErrorDay('')
        setSelectedDay(value)
        setSuccessDay(true)
    }

    const handleSelectedMonth = (value) => {
        setErrorMonth('')
        setSelectedMonth(value)
        setSuccessMonth(true)
    }

    const handleSelectedYear = (value) => {
        setSuccessYear('')
        setSelectedYear(value)
        setSuccessYear(true)
    }

    const handlePassword = (value) => {
        setPassword(value)
        if(value.length < 6) {
            setErrorPassword('Password must contain at least 6 characters')
            setSuccessPassword(false)
        }
        else {
            setErrorPassword('')
            setSuccessPassword(true)
        }
    }

    const handlePasswordConfirm = (value) => {
        setPasswordConfirm(value)
        if(value !== password || value === '' ) {
            setErrorPasswordConfirm('Password must match')
            setSuccessPasswordConfirm(false)
        }
        else {
            setErrorPasswordConfirm('')
            setSuccessPasswordConfirm(true)
        }
    }

    const validate = (form) => {
        let isValidLogin = true;
        let isValidEmail = true;
        let isValidBirthday = true;
        let isValidPassword = true;
        let isValidPasswordConfirm = true;
        let isValidDay = true;
        let isValidMonth = true;
        let isValidYear = true;

        if(login === '' || login.length < 3) {
            setErrorLogin('Enter login')
            isValidLogin = false;
            setSuccessLogin(false)
        }

        if(email === '') {
            setErrorEmail('Enter email')
            isValidEmail = false;
            setSuccessEmail(false)
        }
        else {
            let re = /\S+@\S+\.\S+/;
            if(!re.test(email)) {
                setErrorEmail('Enter valid email')
                isValidEmail = false;
                setSuccessEmail(false)
            }
        }

        if(selectedDay === null) {
            setErrorDay('Select day')
            isValidDay = false;
            setSuccessDay(false)
        }

        if(selectedMonth === null) {
            setErrorMonth('Select month')
            isValidMonth = false;
            setSuccessMonth(false)
        }

        if(selectedYear === null) {
            setErrorYear('Select year')
            isValidYear = false;
            setSuccessYear(false)
        }

        if(password.length < 6) {
            setErrorPassword('Password must contain at least 6 characters')
            isValidPassword = false;
            setSuccessPassword(false)
        }

        if(passwordConfirm !== password || passwordConfirm === '' ) {
            setErrorPasswordConfirm('Password must match')
            isValidPasswordConfirm = false;
            setSuccessPasswordConfirm(false)
        }

        return isValidLogin && isValidEmail &&  isValidBirthday && isValidPassword && isValidPasswordConfirm && isValidDay && isValidMonth && isValidYear
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(validate(e.target)) {
            setIsShowPageLoader(true)
            api.post('/api/auth/register',{
                username: login,
                email: email,
                birthday: `${selectedDay.value}.${selectedMonth.value}.${selectedYear.value}`,
                password: password,
                password_confirmation: passwordConfirm,
            }).then((res) => {
                dispatch(setUser(res.data.user))
                localStorage.setItem('accessToken', res.data.token)
                // navigate(`/${lang}/`);
                // navigate(`/${lang}/login`);
                handleCloseRegistration()
                handleShowRegistrationFinish()
            }).catch(error => {
                if(error.response.data.data.email[0] === 'The email has already been taken.') {
                    setSuccessEmail(false)
                    setErrorEmail('The email has already been taken.')
                }
            }).finally(() => {
                setIsShowPageLoader(false)
            })
        }
    }

    return (
        <>
            {isShowPageLoader && <PageLoader />}
            <Modal centered className="modal-registration" show={show} onHide={handleCloseRegistration}>
                <Modal.Header>
                    <button className='modal-close' onClick={handleCloseRegistration}>
                        <i className="icon icon-close"></i>
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <p className="h1 modal-title">{ t('Sign up') }</p>
                    <p className="modal-subtitle">{ t('Already have an account?') } <span className="color-aqua modal-switch" onClick={switchToLogin}>{ t('Log in') }</span></p>
                    <form className="registration-form" onSubmit={handleSubmit} autoComplete="off">
                        <div style={{display: 'none'}}>
                            <label htmlFor="email">email</label>
                            <input type="email" name="email" id="email"/>
                            <label htmlFor="password">password</label>
                            <input type="password" name="password" id="password"/>
                        </div>
                        <Input type="text" label="Login" success={successLogin} error={errorLogin} handleChange={ handleLogin } />
                        <Input type="text" label="Email" success={successEmail} error={errorEmail} handleChange={ handleEmail } />
                        <Input type="password" label="Password" success={successPassword} error={errorPassword} handleChange={ handlePassword } />
                        <Input type="password" label="Repeat password" success={successPasswordConfirm} error={errorPasswordConfirm} handleChange={ handlePasswordConfirm } />
                        <div className={`form-group ${errorDay || errorMonth || errorYear ? 'error' : ''}`}>
                            <label className="form-label">{ t('Date of Birth') }</label>
                            <div className="registration-form__birthday">
                                <div className="birthday birthday--day">
                                    <div className="form-group">
                                        <Select
                                            placeholder={ t('Day') }
                                            value={selectedDay}
                                            onChange={handleSelectedDay}
                                            options={optionsDays}
                                            isSearchable={false}
                                            className={`react-select-container ${errorDay ? 'error' : ''} ${successDay ? 'success' : ''}`}
                                            classNamePrefix="react-select"
                                        />
                                        {errorDay && <span className="form-group__message">{t(errorDay)}</span>}
                                    </div>
                                </div>
                                <div className="birthday birthday--month">
                                    <div className="form-group">
                                        <Select
                                            placeholder={ t('Month') }
                                            value={selectedMonth}
                                            onChange={handleSelectedMonth}
                                            options={optionsMonths}
                                            isSearchable={false}
                                            className={`react-select-container ${errorMonth ? 'error' : ''} ${successMonth ? 'success' : ''}`}
                                            classNamePrefix="react-select"
                                        />
                                        {errorMonth && <span className="form-group__message">{t(errorMonth)}</span>}
                                    </div>
                                </div>
                                <div className="birthday birthday--year">
                                    <div className="form-group">
                                        <Select
                                            placeholder={ t('Year') }
                                            value={selectedYear}
                                            onChange={handleSelectedYear}
                                            options={optionsYear}
                                            isSearchable={false}
                                            className={`react-select-container ${errorYear ? 'error' : ''} ${successYear ? 'success' : ''}`}
                                            classNamePrefix="react-select"
                                        />
                                        {errorYear && <span className="form-group__message">{t(errorYear)}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-aqua-gradient btn-block">{ t('Sign up for free') }</button>
                        <p className="registration-form__accept">{ t('By clicking \"Sign up for free\", you agree to the') } <br/>
                            <a href="#">{ t('Terms of Use') }</a> { t('and') } <a href="#">{ t('Privacy Policy') }</a>.
                        </p>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalRegistration
