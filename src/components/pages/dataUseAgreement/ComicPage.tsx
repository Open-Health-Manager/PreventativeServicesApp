import { BackButton, Button, Icon, Page, Navigator, Toolbar, BottomToolbar } from 'react-onsenui';
import { ComicPageData } from './pages';

// CSS rules for the comic page
import './ComicPage.css';

export type ComicRoute = {
    page: number | string;
};

export type ComicPageProps = {
    page: number;
    comic: ComicPageData;
    navigator: Navigator<ComicRoute>;
}

function ComicPage(props: ComicPageProps) {
    return <Page
        renderToolbar={() =>
            <Toolbar>{ props.page > 0 && <div className="left"><BackButton/></div> }</Toolbar>
        }
        renderBottomToolbar={() =>
            <BottomToolbar className="comic-toolbar" modifier="aligned"><Button onClick={() => { props.navigator.pushPage({ page: props.page + 1 })}}>{ props.comic.buttonLabel ?? 'Next' } <Icon icon="ion-ios-arrow-forward"/></Button></BottomToolbar>
        }>
        <div className="comic-page">
            { props.page === 0 && <div className="login-banner"><span style={{lineHeight: '32px'}}>Already Have An Account?</span><Button modifier="quiet" onClick={ () => { props.navigator.pushPage({ page: 'signin' }); } }>Sign In</Button></div>}
            <div className="comic-image"><img src={props.comic.image} alt={props.comic.text} /></div>
        </div>
    </Page>;
}

export default ComicPage;