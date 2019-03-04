import React from 'react';
import ReactDOM from 'react-dom';
import Frame from 'react-frame-component';

// import style from '../scss/label.scss';

import Main from './components/Main.jsx';

class Label extends React.Component {
    render() {
        return (
            <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("./label.css")}></link>]}> 
                <div className="app">Hellooo</div>
                <Main/>
            </Frame>
        )
    }
}

const app = document.createElement('div');
app.id = "label-root";

document.body.appendChild(app);
ReactDOM.render(<Label/>, app);