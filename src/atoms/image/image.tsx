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

const Image: FC<ImageProps> = ({className = '', path= '', alt= '', click}) => {

    const basePath = '/LiteMark'; // Chemin de base pour GitHub Pages
    const fullPath = `${basePath}${path.startsWith('/') ? path : `/${path}`}`;

    return (
        <>
            <img className={`${className}`} src={fullPath} alt={alt} onClick={click} />
        </>
    )
}

export default Image;
