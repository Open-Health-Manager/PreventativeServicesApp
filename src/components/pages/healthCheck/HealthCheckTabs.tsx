import { useState } from 'react';
import { Page, Tabbar, Tab, Navigator } from "react-onsenui";
import Summary from './Summary';
import CarePlan from './CarePlan';
import History from './History';


export type HealthCheckTabsProperties = {
    navigator?: Navigator;
};

function HealthCheckTabs(props: HealthCheckTabsProperties) {
    const [index, setIndex] = useState(0);
    return (
        <Page>
            <Tabbar
                onPreChange={({index}: {index: number}) => { setIndex(index) }}
                index={index} renderTabs={(activeIndex, tabbar) => [
                {
                    content: <Summary navigator={props.navigator}/>,
                    tab: <Tab label="Summary" />
                },
                {
                    content: <CarePlan/>,
                    tab: <Tab label="Care Plan" />
                },
                {
                    content: <History/>,
                    tab: <Tab label="History" />
                }
            ]}/>
        </Page>
    )
}

export default HealthCheckTabs;
