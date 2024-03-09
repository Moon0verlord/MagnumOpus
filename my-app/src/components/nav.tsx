import {Component, createEffect, createSignal, onMount} from "solid-js";
import {useLocation} from "@solidjs/router";

const Nav:Component = () => {
    const location = useLocation()
    const [curHtml, setCurHtml] = createSignal(<div></div>);
    onMount(async () => {
        htmlLoad()
    });
    const htmlLoad = () =>{
        const html = location.pathname != "/"?   
            <div class="navbar bg-base-100 bg-gradient-to-r from-blue-300 ...">
            <div class="navbar-start">
                <div class="dropdown">
                    <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M4 6h16M4 12h8m-8 6h16"/>
                        </svg>
                    </div>
                    <ul tabindex="0"
                        class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a href="/home">Home</a></li>
                        <li><a href="/home">Profile</a></li>
                        <li><a href="/home">Settings</a></li>
                        <li><a href="/">Logout</a></li>
                    </ul>
                </div>
                <img class="schimg size-1/5 w-36" src="src/Images/SchubergPhilis.png"></img>
            </div>
            <div class="navbar-end hidden lg:flex">
                <ul class="menu menu-horizontal px-1">
                    <li><a href="/home">Home</a></li>
                    <li><a href="/home">Profile</a></li>
                    <li><a href="/home">Settings</a></li>
                    <li><a href="/">Logout</a></li>
                </ul>
            </div>
            </div> : null;
        setCurHtml(html);
    }
    createEffect(()=>{
        htmlLoad();
    },location.pathname)
   return (
       <div>
           {curHtml()}
       </div>
   )
}
export default Nav;