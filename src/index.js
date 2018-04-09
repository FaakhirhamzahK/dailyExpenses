import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ListView from './listView';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<ListView />, document.getElementById('root'));
registerServiceWorker();
