import React from 'react';

// import style from '../../scss/label.scss';

export default class Main extends React.Component {
    render() {
        // console.log(style);
        return (
            <div style={{"background-color": "lightgreen"}}>
                Inside main
                {/* {style} */}
                test
                {/* {style.toString()} */}
            </div>
        )
    }
}