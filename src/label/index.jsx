import React from 'react';
import ReactDOM from 'react-dom';
import Frame from 'react-frame-component';

class Main extends React.Component {
    render() {
        return (
            <Frame>
                <div>Hello</div>
            </Frame>
        )
    }
}

const app = document.createElement('div');
app.id = "label-root";

document.body.appendChild(app);
ReactDOM.render(<Main/>, app);