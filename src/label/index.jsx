import React from 'react';
import ReactDOM from 'react-dom';

const app = document.createElement('div');
app.id = "label-root";

document.body.appendChild(app);
ReactDOM.render(<div>Hello</div>, app);