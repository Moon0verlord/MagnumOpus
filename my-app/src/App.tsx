import './index.css';
import Nav from "./components/nav";

export const App = (props:any) =>{
    return(
        <div>
            <Nav/>
            {props.children}
        </div>
    )
}
