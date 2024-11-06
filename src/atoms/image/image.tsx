import React, { FC } from 'react';

interface ImageProps {
    /** Class of the image */
    className?: string;

    /** Text alternative of the image */
    alt?: string;

    /** Path of the image */
    path?: string;

    /** Event on click */
    click?: React.MouseEventHandler<HTMLElement>
}

// The baseURL with env variable
const baseURL = import.meta.env.VITE_BASE_URL.replace(/\/$/, '');

const Image: FC<ImageProps> = ({className = '', path= '', alt= '', click}) => {

    const fullPath = `${baseURL}${path.startsWith('/') ? path : `/${path}`}`;

    return (
        <>
            <img className={`${className}`} src={fullPath} alt={alt} onClick={click} />
        </>
    )
}

export default Image;
