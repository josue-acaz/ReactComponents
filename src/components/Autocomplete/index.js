import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Spinner } from '../../components';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

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
    noResultsText="Nenhum resultado encontrado!",
    renderOption=(op)=>(<div className="item">{op.name}</div>)
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

    useEffect(() => { console.log(_open) }, [_open])

    const onChange = (event) => {
        if(!_open) {
            setOpen(true);
        }
        const text = event.target.value;
        setValue(text);
        onChangeText(text);
    };

    const handleOptionSelected = (op) => {
        setValue(op.name);
        getOptionSelected(op);
        handleClose();
        setOpen(false);
    };

    const handleClickEvent = () => {
        if(_value) {
            setValue("");
        }
        setOpen(true);
        handleOpen();
    };

    return(
        <div className={`autocomplete ${className}`}>
            <div className="input">
                <input 
                    type="text" 
                    value={_value} 
                    style={iconPosition === "start" && !noIcon ? styles.paddingStart : styles.empty}
                    onChange={onChange} 
                    placeholder="Pesquise uma cidade..."
                    onClick={handleClickEvent}
                />
                {iconPosition === "end" ? (
                    <>
                        {!loading && (
                            <span style={iconPosition === "start" ? styles.iconStart : styles.iconEnd} className="spanicon">
                                {!noIcon ? icon : <Fragment />}
                            </span>
                        )}
                    </>
                ) : (
                    <span style={iconPosition === "start" ? styles.iconStart : styles.iconEnd} className="spanicon">
                        {!noIcon ? icon : <Fragment />}
                    </span>
                )}
                <span style={styles.iconEnd} className="spanicon">{loading ? <Spinner /> : <ArrowDropDownIcon className="icon" />}</span>
            </div>
            {_open && (
                <span className="auto-container">
                    <div ref={wrapperRef} className="spanoption">
                        {(_value && !loading && options.length === 0) ? (
                            <div className="noresults">{noResultsText}</div>
                        ) : (
                            <div className="options">
                                {options.map((op, index) => (
                                    <div key={op.id} className="op" onClick={() => handleOptionSelected(op)}>
                                        <div style={index===options.length-1 ? styles.noBorderBottom : styles.empty} className="item">{op.name}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
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
    },
    empty: {},
    paddingStart: { paddingLeft: 36 },
    noBorderBottom: { borderBottom: "none" }
};