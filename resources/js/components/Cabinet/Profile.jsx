import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../store/slices/userSlice";
import Input from "../ui/Input";
import Select from "react-select";
import api from "../../api";
import {toast} from "react-toastify";
import ToastMessage from "../Toast/ToastMessage";
import {useTranslation} from "react-i18next";

const Profile = ({ toggleNav }) => {
    const { t } = useTranslation()
    const { lang } = useParams()

    const dispatch = useDispatch()

    const [userName, setUserName] = useState('');
    const [biography, setBiography] = useState('')
    const [displayCountries, setDisplayCountries] = useState([])
    const [countries, setCountries] = useState([])
    const [country, setCountry] = useState({})
    const [user, setUser] = useState({})



    const [errorUserName, setErrorUserName] = useState('')

    const [successUserName, setSuccessUserName] = useState(false)

    useEffect(() => {

        let p = [];

        p.push(api.get('/api/countries'))
        p.push(api.get('/api/user'))

        Promise.all(p).then(res => {


            const countries = res[0].data.data.map((country) => {
                return {
                    value: country.id,
                    label: lang === 'ru' ? country.title_ru : country.title_en
                }
            })
            setCountries(res[0].data.data)
            setDisplayCountries(countries)

            const user = res[1].data.data
            setUserName(user.username)
            setUser(user)
            if(user.country_id) {
                setCountry(countries.find(country => country.value == user.country_id))
            }

            if(user.biography) {
                setBiography(user.biography)
            }
        })
    }, [])

    useEffect(() => {
        const displayCountries = countries.map((country) => {
            return {
                value: country.id,
                label: lang === 'ru' ? country.title_ru : country.title_en
            }
        })
        setDisplayCountries(displayCountries)

    }, [lang])

    useEffect(() => {
        if(user?.country_id) {
            setCountry(displayCountries.find(country => country.value == user.country_id))
        }

    }, [displayCountries])

    const handleUserName = (value) => {
        setUserName(value)
        if(value === '' || value.length < 3) {
            setErrorUserName('Введите имя')
            setSuccessUserName(false)
        }
        else {
            setErrorUserName('')
            setSuccessUserName(true)
        }
    }

    const handleBiography = (value) => {

        if(value.length <= 500) {
            setBiography(value)
        }
    }

    const handleCountry = (value) => {
        setCountry(value)
    }

    const validate = () => {
        let isValidUserName = true

        if(userName === '' || userName.length < 3) {
            setErrorUserName('Введите имя')
            setSuccessUserName(false)
            isValidUserName = false
        }
        else {
            setErrorUserName('')
            setSuccessUserName(true)
            isValidUserName = true
        }

        return isValidUserName
    }

    const saveProfile = () => {
        if(validate()) {
            api.post('/api/user',{
                username: userName,
                biography: biography,
                country_id: country.value ? country.value : ''
            }).then((res) => {
                dispatch(setUser(res.data.data))
                toast(<ToastMessage type='success' title="Успех!" message="Настройки сохранены."/>)
            }).catch(error => {

            })
        }
    }

    return (
        <div className="cabinet-wrapper">
            <p className="h1 cabinet__title">
                <i className="icon icon-arrow-down-long" onClick={toggleNav}></i>
                { t('Profile') }
            </p>
            <p className="h2 cabinet__subtitle">{ t('Username and Biography') }</p>
            <Input type="text" label="Login" value={userName || ''} error={errorUserName} handleChange={ handleUserName } className={'color-white text-lg'}/>

            <div className={`form-group`}>
                <label className="form-label">{ t('Biography') }</label>
                <textarea className="form-control cabinet__biography color-white text-lg" onChange={e => {handleBiography(e.target.value)}} value={biography}></textarea>
                <span className="form-label">{biography.length} / 500</span>
            </div>

            <p className="h2 cabinet__subtitle cabinet__subtitle--language">{ t('Country and language') }</p>
            <div className="form-group">
                <label className="form-label">{ t('Country') }</label>
                <Select
                    placeholder={ t('Country') }
                    value={country}
                    onChange={handleCountry}
                    options={displayCountries}
                    isSearchable={false}
                    className={`react-select-container`}
                    classNamePrefix="react-select"
                />
            </div>
            <div className="cabinet__profile__btn">
                <button type="button" className="btn btn-aqua-gradient" onClick={saveProfile}>{ t('Save') }</button>
            </div>
        </div>
    )
}

export default Profile
