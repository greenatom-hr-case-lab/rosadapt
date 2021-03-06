import React from "react";

export const Loader = () => {
    return(
        <div className="d-flex justify-content-center loader">
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>

    )
}