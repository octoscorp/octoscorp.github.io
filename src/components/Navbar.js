import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import "bootstrap-icons/font/bootstrap-icons.css";
import './Navbar.css';
import { Button } from './Button';

// Logo would normally be a link
function Navbar() {
    // States
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    // Funcs
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    // Callbacks and Listeners
    useEffect(() => {
        showButton();
    }, []);
    window.addEventListener('resize', showButton);

    return (
        <>
        <nav className="navbar font--medium">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo logo-font font--large" onClick={closeMobileMenu}>
                    <span className="logo-font font--extra-large secondary-text-color">O</span>
                    ctoscorp<div className="navbar-logo-underline"></div>
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? 'bi bi-x-lg' : 'bi bi-list'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                        <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                            <span className="nav-links-text">Home</span>
                            <i className='nav-links-icon bi bi-house-fill' />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/coding' className='nav-links' onClick={closeMobileMenu}>
                            <span className="nav-links-text">Coding</span>
                            <i className='nav-links-icon bi bi-code-slash' />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/games' className='nav-links' onClick={closeMobileMenu}>
                            <span className="nav-links-text">Games</span>
                            <i className='nav-links-icon bi bi-dice-2-fill' />
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/art' className='nav-links' onClick={closeMobileMenu}>
                            <span className="nav-links-text">Art</span>
                            <i className='nav-links-icon bi bi-brush-fill' />
                        </Link>
                    </li>
                    {!button && <li className="nav-item">
                        <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                            Sign Up
                        </Link>
                    </li>}
                </ul>
                {button && <Button buttonStyle='btn--outline'>SIGN UP</Button>}
            </div>
        </nav>
        </>
    );
}

export default Navbar;
