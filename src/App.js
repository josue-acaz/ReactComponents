import React, { useEffect, useState } from 'react';
import { Autocomplete } from './components';
import { sleep } from './utils';

import SearchIcon from '@material-ui/icons/Search';
import api from './api';

import './assets/css/globals.css';
import './App.css';

function App() {

  const[options, setOptions] = useState([]);
  const[open, setOpen] = useState(false);
  const[loading, setLoading] = useState(false);

  useEffect(() => {
    if(!open) {
      setOptions([]);
    } else { index(""); }
  }, [open]);

  async function index(text="") {
    setLoading(true);
    try {
        const response = await api.get('/autocomplete', {
            params: { filter: "city", text } 
        });
        await sleep(1e3);
        setOptions(response.data);
        setLoading(false);
    } catch (error) {
        console.log(error);
        setLoading(false);
    }
  }

  const handleOptionSelected = (op) => {
    console.log(op);
  };

  return (
    <div className="App">
      <Autocomplete 
        className="xAutocomplete"
        open={open}
        loading={loading} 
        icon={<SearchIcon className="icon" />} 
        iconPosition="end"
        getOptionSelected={handleOptionSelected}
        handleOpen={() => { setOpen(true) }}
        handleClose={() => { setOpen(false) }}
        options={options} 
        onChangeText={index}
      />
    </div>
  );
}

export default App;
