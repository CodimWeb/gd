import {useEffect, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {
    setCategory,
    setDescription,
    setPhoto,
    setTitle,
    setStep,
    setPhotoName,
    clearTask
} from "../../store/slices/createTaskSlice";
import Input from "../ui/Input";
import Select from 'react-select'
import Cropper from "react-easy-crop";

import api from "../../api";
import {useTranslation} from "react-i18next";

const CreateTaskForm = () => {
    const { t } = useTranslation()
    const {lang} = useParams()
    const task = useSelector(state => state.createTask.task)
    const dispatch = useDispatch()

    const inputFileRef = useRef(null);

    const [categories, setCategories] = useState([])
    const [displayCategories, setDisplayCategories] = useState([])
    const [image, setImage] = useState('')
    const [imageType, setImageType] = useState(null)
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);

    const [errorCategory, setErrorCategory] = useState('')
    const [errorTitle, setErrorTitle] = useState('')
    const [errorDescription, setErrorDescription] = useState('')
    const [errorImage, setErrorImage] = useState('')


    const [successCategory, setSuccessCategory] = useState(false)
    const [successTitle, setSuccessTitle] = useState(false)
    const [successDescription, setSuccessDescription] = useState(false)

    useEffect(() => {
        api.get('/api/categories').then((res) => {
            const displayCategories = res.data.data.map((item) => {
                return {
                    value: item.id,
                    label: lang == 'ru' ? item.name : item.name_en
                }
            })
            setDisplayCategories(displayCategories)
            setCategories(res.data.data)
        })
    }, [])

    useEffect(() => {
        const displayCategories = categories.map((item) => {
            return {
                value: item.id,
                label: lang == 'ru' ? item.name : item.name_en
            }
        })
        setDisplayCategories(displayCategories)
    }, [lang])


    const handlePhoto = (e) => {
        dispatch(setPhotoName(e.target.value))
        let reader = new FileReader();
        reader.onload = () => {
            let base64 = reader.result;
            setImage(reader.result);
        }
        reader.readAsDataURL(e.target.files[0]);
        setImageType(e.target.files[0].type)
    }

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const getCroppedImg = (imageSrc, pixelCrop) => {
        const image = new Image();
        image.src = imageSrc
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        // set each dimensions to double largest dimension to allow for a safe area for the
        // image to rotate in without being clipped by canvas context
        canvas.width = safeArea;
        canvas.height = safeArea;

        // translate canvas context to a central location on image to allow rotating around the center.
        ctx.translate(safeArea / 2, safeArea / 2);
        // ctx.rotate(getRadianAngle(rotation));
        ctx.translate(-safeArea / 2, -safeArea / 2);

        // draw rotated image and store data.
        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // paste generated rotate image with correct offsets for x,y crop values.
        ctx.putImageData(
            data,
            0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
            0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
        );

        dispatch(setPhoto(canvas.toDataURL(imageType)))
        setErrorImage('')
    }

    const cancelCrop = () => {
        inputFileRef.current.value = ''
        setImage('')
        setZoom(1)
        dispatch(setPhoto(''))
    }

    const loadNewImage = () => {
        inputFileRef.current.value = ''
        setZoom(1)
        dispatch(setPhoto(''))
        setImage(null)
    }

    const handleCategory = (value) => {
        dispatch(setCategory(value))
        setErrorCategory('')
        setSuccessCategory(true)
    }

    const handleTitle = (value) => {
        dispatch(setTitle(value))
        if(value === '') {
            setErrorTitle('Enter title')
            setSuccessTitle(false)
        }
        else if(value.length > 100) {
            setErrorTitle('Header must not exceed 100 characters')
            setSuccessTitle(false)
        }
        else {
            setSuccessTitle(true)
            setErrorTitle('')
        }
    }

    const handleDescription = (value) => {
        if(value === '') {
            setErrorDescription('Введите описание')
            setSuccessDescription(false)
        }
        else {
            setErrorDescription('')
            setSuccessDescription(true)
        }
        if(value.length <= 500) {
            dispatch(setDescription(value))
        }

    }

    const validate = () => {
        let isValidCategory = !!task.category.value
        let isValidTitle = !!task.title
        let isValidDescription = task.description.length > 0 && task.description.length <= 500;
        let isValidImage = !!task.photoBase64

        if(!isValidCategory) {
            setErrorCategory('Select category')
            setSuccessCategory(false)
        }

        if(!isValidTitle) {
            setErrorTitle('Enter title')
            setSuccessTitle(false)
        }
        else {
            setErrorTitle('')
            setSuccessTitle(true)
        }

        if(!isValidDescription) {
            setErrorDescription('Enter task description')
            setSuccessDescription(false)
        }
        else {
            setErrorDescription('')
            setSuccessDescription(true)
        }


        if(!isValidImage) {
            setErrorImage('Image not selected')
        }
        else {
            setErrorImage('')
        }

        return isValidCategory && isValidTitle &&  isValidDescription && isValidImage
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(validate()) {
            dispatch(setStep(2))
        }
    }

    const handleWheel = (e) => {
        if(e.deltaY > 0) {
            if(zoom > 0.5) {
                setZoom(zoom - 0.1)
            }

        }
        else {
            if(zoom < 2) {
                setZoom(zoom + 0.1)
            }
        }
    }

    return (
        <form className="create-task__form" onSubmit={handleSubmit}>
            <p className="h1 create-task__title">{ t('ENTER TASK INFORMATION') }</p>

            <div className={`form-group ${errorCategory ? 'error' : ''} ${successCategory ? 'success' : ''}`}>
                <label className="form-label">{ t('Category') }</label>
                <Select
                    placeholder={`${lang == 'ru' ? "Выберите категорию" : "Select category" } `}
                    // value={task.category}
                    onChange={handleCategory}
                    options={displayCategories}
                    isSearchable={false}
                    className={`react-select-container create-task__select`}
                    classNamePrefix="react-select"
                />
                {errorCategory && <span className="form-group__message">{t(errorCategory)}</span>}
            </div>

            <Input type="text" label="Header" value={task.title} success={successTitle} error={errorTitle}  handleChange={handleTitle} />
            {/*<label className="form-label">Название задания</label>*/}
            {/*<input type="text" name="name" className="form-control" value={task.title} onChange={e => {dispatch(setTitle(e.target.value))}}/>*/}

            <div className={`form-group ${errorDescription ? 'error' : ''} ${successDescription ? 'success' : ''}`}>
                <label className="form-label">{ t('Task description') }</label>
                <textarea name="description" cols="30" rows="6" className="form-control"
                          value={task.description}
                          onChange={(e) => {handleDescription(e.target.value)}}
                ></textarea>
                <span className="form-label">{task.description.length} / 500</span>
            </div>

            {/*<label>Логотип задания</label>*/}
            <div className="form-group">
                <div className="load-image">
                    {/*<p>{task.photoName}</p>*/}
                    <label htmlFor="task-logo" className="load-image__label form-control">
                        {task.photoBase64 ?
                            <div className="load-image__result">
                                <img src={task.photoBase64} alt="" onClick={loadNewImage}/>
                            </div>
                            :
                            <span className="btn btn-aqua-gradient load-image__btn">{ t('Upload image') }</span>
                        }
                        {errorImage &&
                            <div className="error">
                                <span className="form-group__message">{errorImage}</span>
                            </div>
                        }
                        <input type="file" id="task-logo" name="logo" ref={inputFileRef} className="form-control load-image__input" accept="image/*" onChange={handlePhoto}/>
                    </label>
                </div>
            </div>
            {image && !task.photoBase64 &&
                <div className="crop-container">
                    <div className="crop-area" onWheel={handleWheel}>
                        <div className="crop-area__content">
                            <img src={image} className="crop-area__image-hidden" alt="" />
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                // aspect={1}
                                cropSize={{width: 500, height: 250}}
                                onCropChange={setCrop}
                                // onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="crop-control-panel">
                            <div className="crop-controls">
                                <input
                                    type="range"
                                    value={zoom}
                                    min={0.5}
                                    max={2}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => {
                                        setZoom(e.target.value)
                                    }}
                                    className="crop-zoom-range"
                                />
                            </div>
                            <button type="button" className="btn btn-cancel crop-save-btn" onClick={cancelCrop}>{ t('Cancel') }</button>
                            <button type="button" className="btn btn-aqua-gradient crop-save-btn" onClick={() => {getCroppedImg(image, croppedArea)}}>{ t('Apply') }</button>
                        </div>
                    </div>

                </div>
            }

            <div className="create-task__btn-container">
                <Link to={`/${lang}/`} className="btn btn-cancel" onClick={() => {dispatch(clearTask())}}>{ t('Cancel') }</Link>
                <button type="submit" className="btn btn-aqua-gradient">{ t('Next') }</button>
            </div>
        </form>
    )
}

export default CreateTaskForm
