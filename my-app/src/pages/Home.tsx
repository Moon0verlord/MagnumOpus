import {myApiComponent} from '../components/MyApiComponent'
import {User} from "../lib/server/db/types";
import {createEffect, createSignal} from "solid-js";
import {getInititalUsers} from "../lib/server/db";
const Home = () => {
    const [users,setUser] = createSignal<User[]>([])
   
    return (
        <div>
            {myApiComponent()}
        </div>
    );
};

export default Home;
