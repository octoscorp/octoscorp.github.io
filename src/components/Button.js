import React from 'react';
import './Button.css';
import {Link} from 'react-router-dom';

const STYLES = ['btn--bright', 'btn--outline'];

const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({destination, children, type, onClick, buttonStyle, buttonSize}) => {
    const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
    const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

    // TODO: Make not btn-mobile
    return (
        <Link to={`/${destination}`} className='btn-mobile'>
            <button className={`btn ${checkButtonStyle} ${checkButtonSize}`} onClick={onClick} type={type}>
                {children}
            </button>
        </Link>
    )
};