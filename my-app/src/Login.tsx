import {useNavigate} from "@solidjs/router";
import { createSignal } from "solid-js";

type MyPersonalInputEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
};

type registerForm = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = createSignal<registerForm>({
        email: "",
        password: "",
    });
    const [loggedIn, setLoggedIn] = createSignal(false);
    const RealEmail = "a@a.com";
    const CurrPassword = "abc";

    const handleInput = (e: MyPersonalInputEvent) => {
        const { name, value } = e.currentTarget;
        setForm((prev) => ({ ...prev, [name]: value })); // Update specific field based on `name`
        
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (RealEmail === form().email && CurrPassword === form().password) {
            setLoggedIn(true);
            navigate("/home", { replace: true })
        } else {
            console.error("Login failed");
        }
    };
    if(loggedIn()){
        
    }
    
    return (
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="login p-6 space-y-4 md:space-y-6 sm:p-8">
            <div class="header">
                <div class="text">Inloggen</div>
                <div class="underline"></div>
            </div>

            <div class="inputs">
                <div class="input">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        onInput={handleInput}
                    />
                </div>
                <div class="input">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Wachtwoord"
                        onInput={handleInput}
                    />
                </div>
            </div>
            <button onClick={handleSubmit} class={`submit ${"Oops" ? "disabled" : ""}`}>
                Inloggen
            </button>
        </div>
        </div>
        </div>  
    );
}
