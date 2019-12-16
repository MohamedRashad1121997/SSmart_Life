import React from 'react';
import './style.css';
import log from "./log.png"
import { Link } from 'react-router-dom';

const Logo = props => {
    return (
        <Link to="/">
            <div className="Logo" {...props}>
               <img src={log} />
                {/* <span>Smart Life</span> */}
            </div>
        </Link>
        
    );
}

export default Logo;