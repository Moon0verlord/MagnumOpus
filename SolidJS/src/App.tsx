import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import Home from "./pages/Home";
import Repo from "./Login";

import './index.css';
import Nav from "./components/nav";

export const App = (props:any) => (
    <div>
        

    </div>
);

render(
    () => (
        <div>
            <Nav/>
            <Router>
                <Route path="/Logout" component={Repo} />
                <Route path="/" component={Home} />
            </Router>
        </div>

    ),
    document.getElementById("app") as HTMLElement
);