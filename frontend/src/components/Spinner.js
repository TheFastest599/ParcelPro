import React, { useContext } from 'react';
import globalContext from '../context/global/globalContext';

function Spinner() {
  const gcontext = useContext(globalContext);
  const { spinner } = gcontext;
  return (
    <>
      {spinner && (
        <div className="text-center" id="spinner">
          <div className="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Spinner;
