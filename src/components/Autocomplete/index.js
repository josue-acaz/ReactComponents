import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Spinner } from '../../components';

import './styles.css';

function useOutsideAutocomplete(ref, onClickOutside=(clickedOutside=false)=>clickedOutside) {
    useEffect(() => {
        /**
         * If clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClickOutside(true);
            } else { onClickOutside(false); }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onClickOutside]);
}

export default function Autocomplete({ 
    open=false, 
    value="", 
    loading=false, 
    className="", 
    options=[], 
    icon=<Fragment />,
    noIcon=false,
    getOptionSelected = (op) => op,
    iconPosition="start",
    onChangeText=(value= "") => value,
    handleOpen=()=>{},
    handleClose=()=>{},
    noResultsText="Nenhum resultado encontrado!"
}) {

    const[_open, setOpen] = useState(open);
    const[_value, setValue] = useState(value);
    const wrapperRef = useRef(null);
    useOutsideAutocomplete(wrapperRef, (clickedOutside) => {
        if(clickedOutside) {
            setOpen(false);
        }
    });

    useEffect(() => {
        if(open) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [open]);

    const onChange = (event) => {
        const text = event.target.value;
        setValue(text);
        onChangeText(text);
    };

    const handleOptionSelected = (op) => {
        setValue(op.name);
        getOptionSelected(op);
        handleClose();
    };

    return(
        <div className={`autocomplete ${className}`}>
            <div className="input">
                <input 
                    type="text" 
                    value={_value} 
                    onChange={onChange} 
                    onClick={() => {
                        setOpen(true);
                        handleOpen();
                    }}
                />
                <span style={iconPosition === "start" ? styles.iconStart : styles.iconEnd} className="spanicon">
                    {loading ? <Spinner /> : !noIcon ? icon : <Fragment />}
                </span>
            </div>
            {_open && (
                <span ref={wrapperRef} className="spanoption">
                    {(value && !loading && options.length === 0) ? (
                        <div className="noresults">{noResultsText}</div>
                    ) : (
                        <div className="options">
                            {options.map(op => <div key={op.id+""} className="item" onClick={() => handleOptionSelected(op)}>{op.name}</div>)}
                        </div>
                    )}
                </span>
            )}
        </div>
    );
}

const styles = {
    iconStart: {
        left: '.5rem'
    },
    iconEnd: {
        right: '.5rem'
    }
};