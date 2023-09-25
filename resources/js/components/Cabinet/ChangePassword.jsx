import Input from "../ui/Input";
import {useState} from "react";
import api from "../../api";
import {toast} from "react-toastify";
import ToastMessage from "../Toast/ToastMessage";
import {useTranslation} from "react-i18next";


const ChangePassword = ({ toggleNav }) => {
    const { t } = useTranslation()

    const [previousPassword, setPreviousPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    const [errorPreviousPassword, setErrorPreviousPassword] = useState('');
    const [errorNewPassword, setErrorNewPassword] = useState('')
    const [errorNewPasswordConfirm, setErrorNewPasswordConfirm] = useState('')

    const [successPreviousPassword, setSuccessPreviousPassword] = useState(false)
    const [successNewPassword, setSuccessNewPassword] = useState(false)
    const [successNewPasswordConfirm, setSuccessNewPasswordConfirm] = useState(false)

    const [isSuccessPasswordChange, setIsSuccessPasswordChange] = useState(false)

    const handlePreviousPassword = (value) => {
        setPreviousPassword(value)
        if(value.length < 6) {
            setErrorPreviousPassword('Password must contain at least 6 characters')
            setSuccessPreviousPassword(false)
        }
        else {
            setErrorPreviousPassword('')
            setSuccessPreviousPassword(true)
        }
    }

    const handleNewPassword = (value) => {
        setNewPassword(value)
        if(value.length < 6) {
            setErrorNewPassword('Password must contain at least 6 characters')
            setSuccessNewPassword(false)
        }
        else {
            setErrorNewPassword('')
            setSuccessNewPassword(true)
        }
    }

    const handleNewPasswordConfirm = (value) => {
        setNewPasswordConfirm(value)
        if(value !== newPassword || value === '' ) {
            setErrorNewPasswordConfirm('Password must match')
            setSuccessNewPasswordConfirm(false)
        }
        else {
            setErrorNewPasswordConfirm('')
            setSuccessNewPasswordConfirm(true)
        }
    }

    const validateNewPassword = () => {
        let isValidPreviousPassword = true;
        let isValidNewPassword = true;
        let isValidNewPasswordConfirm = true;

        if(previousPassword.length < 6) {
            setErrorPreviousPassword('Password must contain at least 6 characters')
            setSuccessPreviousPassword(false)
            isValidPreviousPassword = false;
        }

        if(newPassword.length < 6) {
            setErrorNewPassword('Password must contain at least 6 characters')
            setSuccessNewPassword(false)
            isValidNewPassword = false;
        }

        if(newPasswordConfirm !== newPassword || newPasswordConfirm === '' ) {
            setErrorNewPasswordConfirm('Password must match')
            setSuccessNewPasswordConfirm(false)
            isValidNewPasswordConfirm = false;
        }

        return isValidPreviousPassword && isValidNewPassword && isValidNewPasswordConfirm
    }

    const changePassword = (e) => {
        e.preventDefault()

        if(validateNewPassword(e.target)) {
            api.post('/api/user/change-password',{
                password: previousPassword,
                new_password: newPassword,
                new_password_confirmation: newPasswordConfirm,
            }).then((res) => {
                if(res.data.success) {
                    toast(<ToastMessage type='success' title="Success" message="Settings have been saved"/>)
                    setPreviousPassword('')
                    setNewPassword('')
                    setNewPasswordConfirm('')

                    setErrorPreviousPassword('')
                    setErrorNewPassword('')
                    setErrorNewPasswordConfirm('')

                    setSuccessPreviousPassword(false)
                    setSuccessNewPassword(false)
                    setSuccessNewPasswordConfirm(false)

                    setIsSuccessPasswordChange(true)
                    e.target.reset()
                }
            }).catch(error => {
                if(error.response.data.data === 'These credentials do not match our records.') {
                    setErrorPreviousPassword('Incorrect password')
                    setSuccessPreviousPassword(false)
                }
                else if(error.response.data.data.new_password[0] === 'The new password field and password must be different.') {
                    setErrorNewPassword('Old and new new password must not match')
                    setSuccessNewPassword(false)
                }

            })
        }
    }

    return (
        <div className="cabinet-wrapper">
            <p className="h1 cabinet__title">
                <i className="icon icon-arrow-down-long" onClick={toggleNav}></i>
                { t('Password') }
            </p>
            <form onSubmit={changePassword}>
                <Input
                    type="password"
                    label="Current Password"
                    placeholder={ t('Current Password') }
                    error={errorPreviousPassword}
                    success={successPreviousPassword}
                    handleChange={handlePreviousPassword}
                />
                <Input
                    type="password"
                    label="New password"
                    placeholder={ t('New password') }
                    error={errorNewPassword}
                    success={successNewPassword}
                    handleChange={handleNewPassword}
                />
                <Input type="password"
                       label="Confirm new password"
                       placeholder={ t('Confirm new password') }
                       error={errorNewPasswordConfirm}
                       success={successNewPasswordConfirm}
                       handleChange={handleNewPasswordConfirm}
                />
                <div className="cabinet__profile__btn">
                    <button type="submit" className="btn btn-aqua-gradient">{ t('Save') }</button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
