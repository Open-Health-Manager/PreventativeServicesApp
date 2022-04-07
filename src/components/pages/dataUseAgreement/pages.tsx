// This module contains the data for all the actual pages. It may eventually
// be replaced by something more, er, sane, but for now, it works.

import Page1 from './pages/page1.png';
import Page2 from './pages/page2.png';
import Page3 from './pages/page3.png';
import Page4 from './pages/page4.png';
import Page5 from './pages/page5.png';
import Page6 from './pages/page6.png';
import Page7 from './pages/page7.png';
import Page8 from './pages/page8.png';
import Page9 from './pages/page9.png';
import Page10 from './pages/page10.png';
import Page11 from './pages/page11.png';
import Page12 from './pages/page12.png';
import Page13 from './pages/page13.png';

export type ComicPageData = {
    text: string;
    image: string;
    buttonLabel?: string;
}

export const PAGES: ComicPageData[] = [
    {
        text: "Get control of your health. Follow me and learn how!",
        image: Page1
    },
    {
        text: "Your data can come from anywhere... from you, the doctor\u2019s office, or a device like your phone. We put it all in the same place.",
        image: Page2
    },
    {
        text: "Now you can finally have one place to see your entire health picture.",
        image: Page3
    },
    {
        text: "Mistakes Happen. This is why you can correct (with some exceptions) and annotate your data.",
        image: Page4
    },
    {
        text: "You can share your data with anyone. We always need your permission before sharing your data.",
        image: Page5
    },
    {
        text: "You can share your data with recommendation services to access suggestions for a healthier lifestyle.",
        image: Page6
    },
    {
        text: "You can share data automatically during an emergency. First responders would be able to see critical health information about you.",
        image: Page7
    },
    {
        text: "You can review who has access to your data.",
        image: Page8,
        buttonLabel: "Half-way through, continue"
    },
    {
        text: "You can stop sharing your data at any time.",
        image: Page9
    },
    {
        text: "However, those you have shared with may keep a copy of your data. But, they cannot get any new data after you stop sharing.",
        image: Page10
    },
    {
        text: "You can delete your data. We won\u2019t keep a copy. However, we can\u2019t make people delete the data you already shared with them.",
        image: Page11
    },
    {
        text: "You can transfer your data. We won't keep a copy.",
        image: Page12
    },
    {
        text: "We\u2019re responsible for keeping your data safe. You can hold us accountable if there is a data breach from Open Health Manager.",
        image: Page13
    }
];

export default PAGES;