import {NavLink, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Cropper from "react-easy-crop";
import {useState} from "react";
import {setUser} from "../../store/slices/userSlice";
import api from "../../api";
import {useTranslation} from "react-i18next";

const CabinetNav = ({ isOpenNav, toggleNav }) => {
    const { t } = useTranslation()
    const { lang } = useParams()

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)

    const [image, setImage] = useState('')
    const [imageType, setImageType] = useState(null)
    const [croppedArea, setCroppedArea] = useState(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);


    const handlePhoto = (e) => {
        let reader = new FileReader();
        reader.onload = () => {
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

        api.post('/api/user/avatar', {
            avatar: canvas.toDataURL(imageType)
        }).then((res) => {
            dispatch(setUser(res.data.data))
            setImage('')
            setZoom(1)
        }).catch(error => {

        })
    }

    const cancelCrop = () => {
        setImage('')
        setZoom(1)
    }

    const handleWheel = (e) => {
        if(e.deltaY > 0) {
            if(zoom > 0.3) {
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
        <>
            <div className={`cabinet-nav ${isOpenNav ? 'open': ''}`}>
                <div className="cabinet-nav__content">
                    <label htmlFor="load-user-avatar" className="cabinet__user-photo">
                        {user.avatar ?
                            <img src={user.avatar} alt=""/>
                            :
                            <div className="cabinet__load-avatar">
                                <i className="icon icon-camera"></i>
                            </div>
                        }
                        <input type="file" id="load-user-avatar" onChange={handlePhoto}/>
                    </label>

                    <div className="cabinet__user-name">{user.username}</div>

                    <ul className="cabinet-nav__list">
                        <li className="cabinet-nav__list__item">
                            <NavLink to={`/${lang}/cabinet/account`} className="cabinet-nav__list__link" onClick={toggleNav}>
                                <i className="icon icon-user"></i>
                                { t('My account') }
                            </NavLink>
                        </li>
                        <li className="cabinet-nav__list__item">
                            <NavLink to={`/${lang}/cabinet/profile`} className="cabinet-nav__list__link" onClick={toggleNav}>
                                <i className="icon icon-edit"></i>
                                { t('Profile') }
                            </NavLink>
                        </li>
                        <li className="cabinet-nav__list__item">
                            <NavLink to={`/${lang}/cabinet/password`} className="cabinet-nav__list__link" onClick={toggleNav}>
                                <i className="icon icon-lock"></i>
                                { t('Password') }
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            {image &&
                <div className="crop-container">
                    <div className="crop-area" onWheel={handleWheel}>
                        <div className="crop-area__content">
                            <img src={image} className="crop-area__image-hidden" alt="" />
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                // aspect={1}
                                cropSize={{width: 96, height: 96}}
                                cropShape="round"
                                onCropChange={setCrop}
                                // onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                        <div className="crop-control-panel">
                            <div className="crop-controls">
                                <input
                                    type="range"
                                    id="avatar-range"
                                    value={zoom}
                                    min={0.3}
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
                            <button type="button" className="btn btn-aqua-gradient crop-save-btn" onClick={() => {getCroppedImg(image, croppedArea)}}>{ t('Save') }</button>
                        </div>
                    </div>

                </div>
            }
        </>
    )
}

export default CabinetNav
