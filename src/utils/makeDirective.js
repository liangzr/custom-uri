import React from 'react';
import ReactDOM from 'react-dom';
import { noop } from '../tools';

export default (WrappedComponent, id) => {
  // eslint-disable-next-line no-param-reassign
  WrappedComponent.show = (props, callback = noop, validator = noop) => {
    let targetDOM = document.querySelector(`#${id}`);
    if (!targetDOM) {
      targetDOM = document.createElement('div');
      targetDOM.id = id;
      document.body.appendChild(targetDOM);
    }
    ReactDOM.unmountComponentAtNode(targetDOM);
    ReactDOM.render(<WrappedComponent cb={callback} validator={validator} {...props} />, targetDOM);
  };

  return WrappedComponent;
};
