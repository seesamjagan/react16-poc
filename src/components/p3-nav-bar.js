import React from 'react';
import { NavLink } from 'react-router-dom';

export const P3NavBar = ({ items = [], logo: Logo = null }) => {
    return <nav className="p3-nav-bar">
        {Logo && <Logo />}
        {items && items.map(item => <NavLink to={item.route} key={item.route}>⚙ {item.label}</NavLink>)}
    </nav>
}

export const getNavItem = (route, label, className = undefined) => ({ route, label, className });

export default P3NavBar; 