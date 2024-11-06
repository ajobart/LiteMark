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

    return (
        <>
            <img className={`${className}`} src={path} alt={alt} onClick={click} />
        </>
    )
}

export default Image;
