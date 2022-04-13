import { Navigator, Page, Toolbar, BackButton } from 'react-onsenui';
import ComicPage, { ComicRoute } from './ComicPage';
import SignaturePage from './SignaturePage';
import SignIn from '../signIn/SignIn';
import SignUp from '../signIn/SignUp';
import PAGES from './pages';

function BrokenPage(props: { error: string }) {
    return <Page renderToolbar={() => <Toolbar><div className="left"><BackButton>Back</BackButton></div><div className="center">Error</div></Toolbar>}>
        <h1>Error</h1>
        <p>{props.error}</p>
    </Page>
}

function Onboarding() {
    return <Navigator
        renderPage={(route: ComicRoute, navigator: Navigator<ComicRoute>) => {
            if (typeof route.page === 'number') {
                if (route.page === PAGES.length) {
                    // Indicates we're at the signature page
                    return <SignaturePage navigator={navigator}/>
                }
                const page = PAGES[route.page];
                if (page) {
                    return <ComicPage page={route.page} comic={page} navigator={navigator} />
                } else {
                    return <BrokenPage error={`Invalid page ${route.page}.`}/>;
                }
            } else {
                switch (route.page) {
                    case 'signin':
                        return <SignIn navigator={navigator}/>
                    case 'createAccount':
                        return <SignUp navigator={navigator}/>
                }
            }
            return <BrokenPage error={`Unknown route ${route.page}`}/>;
        }}
        initialRoute={{page: 0}}
    />;
}

export default Onboarding;