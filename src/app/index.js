import { lazy, Suspense, useEffect, createContext, useReducer, Fragment } from 'react';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { Transition, config as transitionConfig } from 'react-transition-group';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import VCROSDMono from 'assets/fonts/vcr-osd-mono.woff2';
import AmongUs from 'assets/fonts/among-us.woff2';
import { useLocalStorage, usePrefersReducedMotion } from 'hooks';
import { initialState, reducer } from 'app/reducer';
import { reflow } from 'utils/transition';
import { initiateSocket, disconnectSocket } from 'utils/socket';
import prerender from 'utils/prerender';
import './reset.css';
import './index.css';
const Start = lazy(() => import('pages/Start'));
const Play = lazy(() => import('pages/Menu'));
const Lobby = lazy(() => import('pages/Lobby'));
const Dashboard = lazy(() => import('pages/Dashboard'));
const Staking = lazy(() => import('pages/Staking'));
const Farming = lazy(() => import('pages/Farming'));
const NotFound = lazy(() => import('pages/404'));
const About = lazy(() => import('pages/About'));

export const AppContext = createContext();

const repoPrompt = `Developed by amongus.finance`;

export const fontStyles = `
  @font-face {
    font-family: "VCR-OSD-Mono";
    src: url(${VCROSDMono}) format("woff");
    font-display: swap;
  }

  @font-face {
    font-family: "amongus";
    src: url(${AmongUs}) format("woff2");
    font-display: swap;
  }
`;

const App = () => {
  const [storedUsername] = useLocalStorage('username', null);
  const [storedColor] = useLocalStorage('color', 'red');
  const [state, dispatch] = useReducer(reducer, initialState);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      transitionConfig.disabled = true;
    } else {
      transitionConfig.disabled = false;
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!prerender) {
      console.info(`${repoPrompt}\n\n`);
    }

    window.history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    initiateSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    dispatch({ type: 'setUsername', value: storedUsername });
  }, [storedUsername]);

  useEffect(() => {
    dispatch({ type: 'setColor', value: storedColor });
  }, [storedColor]);

  return (
    <HelmetProvider>
      <AppContext.Provider value={{ ...state, dispatch }}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppContext.Provider>
    </HelmetProvider>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Fragment>
      <Helmet>
        <link rel="canonical" href={`https://amongus.finance${pathname}`} />
        <link rel="preload" href={VCROSDMono} as="font" crossorigin="" />
        <link rel="preload" href={AmongUs} as="font" crossorigin="" />
        <style>{fontStyles}</style>
      </Helmet>
      <Transition
        key={pathname}
        timeout={200}
        onEnter={reflow}
      >
        {status => (
          <Suspense fallback={<Fragment />}>
            <Switch location={location}>
              <Route exact path="/" component={Start} />
              <Route exact path={['/lobby', '/lobby/:id']} component={Lobby} />
              <Route exact path="/play" component={Play} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/staking" component={Staking} />
              <Route exact path="/farming" component={Farming} />
              <Route exact path="/about" component={About} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        )}
      </Transition>
    </Fragment>
  );
};

export default App;
