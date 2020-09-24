import * as React from 'react';

import Styles from "./MonthSwitcher.module.css";

interface IMonthSwitcherProps {
    currentMonth: Date;
    onChangeMonth: (newDate: Date) => void;
}

const MonthSwitcher: React.FunctionComponent<IMonthSwitcherProps> = (props) => {
    return <div className={Styles.container}>
        <div className="button" onClick={() =>
            props.onChangeMonth(new Date(props.currentMonth.setMonth(props.currentMonth.getMonth() - 1)))
        }>
            <i className="fas fa-chevron-left"></i>
        </div>
        <div>{props.currentMonth.toLocaleString('default', { month: 'long' })}</div>
        <div className="button" onClick={() =>
            props.onChangeMonth(new Date(props.currentMonth.setMonth(props.currentMonth.getMonth() + 1)))
        }>
            <i className="fas fa-chevron-right"></i>
        </div>
    </div>;
};

export default MonthSwitcher;
