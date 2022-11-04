import React from 'react';

const Spinner = () => {
    return (
        <div className="d-flex">
            <div className="spinner-border text-black-50">
                <span data-testid="spinner" className="sr-only">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;