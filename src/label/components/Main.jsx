import React from 'react';

import style from '../../scss/label.scss';

export default class Main extends React.Component {
    render() {
        console.log(style);
        return (
            <div className={style.label}>
                Inside main
                test
                {/* {style.toString()} */}
                <div className={style.app}>
                    Hello world
                </div>
            </div>
        )
    }
}