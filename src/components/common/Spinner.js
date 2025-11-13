import React, { Component } from 'react'
import loading from '../../loading.gif';

export class Spinner extends Component {
  render() {
    return (
      <div className='text-center' 
        style={{
          position: "fixed",       // sabke upar overlay
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.7)", // halki overlay background
          zIndex: 9999           // highest priority
        }}
      >
        <img src={loading} alt='loading' />
      </div>
    )
  }
}

export default Spinner
