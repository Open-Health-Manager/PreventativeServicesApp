import { NavLink } from "react-router-dom";
import { Page, Tabbar, Tab } from "react-onsenui";

import "./header.css"


function header() {
    return (
        <Page>
            <Tabbar renderTabs={(activeIndex, tabbar) => [
                {
                    tab: <Tab label="Summary" />
                },
                {
                    tab: <Tab label="Care Plan" />
                },
                {
                    tab: <Tab label="History" />
                }
            ]}/>
        </Page>
    )
}

export default header;
