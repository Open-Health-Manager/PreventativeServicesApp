import { BackButton, Button, Page, Navigator, Toolbar, BottomToolbar } from 'react-onsenui';
import { ComicPageData } from './pages';

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
            <BottomToolbar><Button onClick={() => { props.navigator.pushPage({ page: props.page + 1 })}}>{ props.comic.buttonLabel ?? 'Next' }</Button></BottomToolbar>
        }>
        { props.page === 0 && <p>Already Have An Account? <Button modifier="quiet" onClick={ () => { props.navigator.pushPage({ page: 'signin' }); } }>Sign In</Button></p>}
        <img src={props.comic.image} alt={props.comic.text} />
    </Page>;
}

export default ComicPage;