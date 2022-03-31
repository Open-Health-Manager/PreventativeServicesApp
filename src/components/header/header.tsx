import { useState } from 'react';
import { Page, Tabbar, Tab } from "react-onsenui";

import "./header.css"

function Header() {
    const [index, setIndex] = useState(0);
    return (
        <Page>
            <Tabbar
                onPreChange={({index}: {index: number}) => { setIndex(index) }}
                index={index} renderTabs={(activeIndex, tabbar) => [
                {
                    content: <Page>Summary</Page>,
                    tab: <Tab label="Summary" />
                },
                {
                    content: <Page>Care Plan</Page>,
                    tab: <Tab label="Care Plan" />
                },
                {
                    content: <Page>History</Page>,
                    tab: <Tab label="History" />
                }
            ]}/>
        </Page>
    )
}

export default Header;
