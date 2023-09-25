import React, { useState } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import {Link, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {closeSidebarOnTablet} from "../../store/slices/sidebarSlice";
import {useDispatch} from "react-redux";

const SidebarCollapse = ({title, id, offer}) => {
    const { t, i18n } = useTranslation();
    const { lang } = useParams()
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);

    return (
        <div className="sidebar-collapse">
            <button className={`btn btn-collapse-toggle sidebar-collapse-toggle ${open ? 'open': ''}`} onClick={() => setOpen(!open)}>
                {title}
                <i className="icon icon-arrow-down"></i>
            </button>
            <Collapse in={open}>
                <div>
                    <div className="sidebar-collapse-content">
                        <Link to={`/${lang}/task/${id}`}
                              className="btn btn-aqua-gradient sidebar-link-task"
                              onClick={() => {dispatch(closeSidebarOnTablet())}}
                        >
                            { t('Go to task') }
                        </Link>
                        <Link
                            to={`/${lang}/task/${id}/chat`}
                            className="btn btn-aqua-gradient-ghost sidebar-link-user"
                            onClick={() => {dispatch(closeSidebarOnTablet())}}
                        >
                            { t('Go to executor') }
                        </Link>

                    </div>
                </div>
            </Collapse>
        </div>
    )
}

export default SidebarCollapse
