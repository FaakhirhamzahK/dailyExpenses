import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
  render() { 

    if(!this.props.show) {
      return null;
    }

    return (
      <div style={backgroundStyle}>
        <div style={modalStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node
};

const backgroundStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.3)',
  padding: 50
}

const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: 5,
    maxWidth: 354,
    margin: '0 auto',
    padding: 30
}
export default Modal;