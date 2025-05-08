import React from 'react';
import { ThreeDots } from 'react-spinners';

const Loader = ({ loading, height = 50, width = 50, backgroundColor }) => {
    if (!loading) {
        return null;
    }

    const loaderContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', 
        backgroundColor: backgroundColor || 'transparent', 
    };

    return (
        <div className="loader-container" data-testid="loader" style={loaderContainerStyle}>
            <ThreeDots
                height={height}
                width={width}
                color='#007bff'
                ariaLabel="three-dots-loading"
            />
        </div>
    );
};

export default Loader;