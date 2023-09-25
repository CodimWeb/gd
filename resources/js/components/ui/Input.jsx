import { useTranslation } from "react-i18next";
import {useEffect, useRef, useState} from "react";

const Input = ({ type, name, label, value, success, error, readonly, handleChange, className, placeholder }) => {
    const { t } = useTranslation()
    const [disableAutocomplete, setDisableAutocomplete] = useState(true)
    const disableAutocompleteTimeOut = useRef(null);

    useEffect(() => {

        // disableAutocompleteTimeOut.current = setTimeout(() => {
        //     setDisableAutocomplete(false)
        // }, 1000)
        //
        // return () => {
        //     clearTimeout(disableAutocompleteTimeOut.current)
        // }
    }, [])

    return (
        <div className={`form-group ${error ? 'error' : ''} ${success ? 'success' : ''}`}>
            <div>
                <label className="form-label">{ t(label) }</label>
            </div>
            <div className="form-control-group">
                <input type={type}
                       name={name}
                       value={value}
                       className={`form-control form-control-with-icon ${className ? className : ''}`}
                       onChange={ e => {handleChange(e.target.value)} }
                       onFocus={() => {setDisableAutocomplete(false)}}
                       readOnly={readonly} // for readonly inputs
                       placeholder={placeholder ? placeholder : ''}
                       data-lpignore="true"
                       autoComplete="new-password" // for disable autocomplete v1
                       readOnly={disableAutocomplete} // for disable autocomplete v2
                />
                {success && <i className="icon icon-done"></i>}
                {error && <i className="icon icon-close"></i>}
            </div>
            {error && <span className="form-group__message">{t(error)}</span>}
        </div>
    )
}

export default Input;
