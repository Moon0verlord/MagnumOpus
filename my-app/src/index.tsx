// index.tsx
import { render } from 'solid-js/web';
import './index.css';
import {App} from "./App";
import { Route, Router } from "@solidjs/router";
import LoginPage from "./Login";
import Home from "./pages/Home";


const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

render(
    () => (
        <Router root={App}>
            <Route path="/" component={LoginPage} />
            <Route path="/home" component={Home} />
        </Router>
    ),
    root!
);