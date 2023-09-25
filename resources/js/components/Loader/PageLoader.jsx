import {useTranslation} from "react-i18next";

const PageLoader = () => {
    const { t } = useTranslation();

    return (
        <div className="page-loader">
            <div className="page-loader__content">
                <div className="page-loader__logo">
                    <svg width="100" height="118" viewBox="0 0 100 118" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.31 8.33594L30.2644 62.0719L53.5424 48.0797L66.779 40.1234L77.2769 48.0797L40.7623 69.6403V90.9996C46.6019 93.729 51.6595 95.466 54.9117 95.373V115.051C52.1731 115.429 45.2354 115.732 39.393 113.916V90.3485C36.4785 88.9398 33.3956 87.3089 30.2644 85.5539V109.753L16.115 98.7788V77.0638C10.3038 73.3759 4.99292 69.781 1.05272 66.9914C-1.13816 41.5614 12.3114 17.2919 19.31 8.33594Z" fill="url(#paint0_linear_757_11276)"/>
                        <path d="M54.9117 75.3166L87.7749 56.3955C89.6006 58.5399 93.0695 64.191 92.3392 69.6403C92.7956 74.9448 94.8039 85.5539 99.1857 85.5539V105.969L87.7749 113.916V90.9996C86.2534 90.313 82.389 86.745 79.1027 77.9656L64.0404 86.6693C67.2354 90.2012 74.3558 97.3408 77.2769 97.6435V117.7C76.3641 115.254 72.4387 110.846 64.0404 112.78V86.6693C63.1275 84.1465 60.0238 78.344 54.9117 75.3166Z" fill="url(#paint1_linear_757_11276)"/>
                        <path d="M37.7426 28.3578C41.0721 19.0725 44.7043 10.5401 55.9038 0L52.6306 48.685L37.7426 28.3578Z" fill="url(#paint2_linear_757_11276)"/>
                        <defs>
                            <linearGradient id="paint0_linear_757_11276" x1="0.814331" y1="63.0179" x2="99.1857" y2="63.0179" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4284DB"/>
                                <stop offset="1" stopColor="#29EAC4"/>
                            </linearGradient>
                            <linearGradient id="paint1_linear_757_11276" x1="0.814331" y1="63.0179" x2="99.1857" y2="63.0179" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4284DB"/>
                                <stop offset="1" stopColor="#29EAC4"/>
                            </linearGradient>
                            <linearGradient id="paint2_linear_757_11276" x1="37.7426" y1="24.3425" x2="55.9038" y2="24.3425" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4284DB"/>
                                <stop offset="1" stopColor="#29EAC4"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="page-loader__text">{t('Loading')}...</div>
            </div>
        </div>
    )
}

export default PageLoader
