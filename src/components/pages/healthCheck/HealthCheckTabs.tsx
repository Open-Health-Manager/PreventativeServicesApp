import { useState } from 'react';
import { Page, Tabbar, Tab } from "react-onsenui";
import Summary from './Summary';
import CarePlan from './CarePlan';
import History from './History';

function HealthCheckTabs() {
    const [index, setIndex] = useState(0);
    return (
        <Page>
            <Tabbar
                onPreChange={({index}: {index: number}) => { setIndex(index) }}
                index={index} renderTabs={(activeIndex, tabbar) => [
                {
                    content: <Summary/>,
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
