import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState<Boolean>();

    async function login(event: any) {
        event.preventDefault();
        const input = event.target;

        let account: { username: string; password: string } = {
            username: input[0].value,
            password: input[1].value,
        };

        const response = await fetch("http://localhost:5555/api/login", {
            method: "POST",
            body: JSON.stringify(account),
            headers: { "Content-Type": "application/json" },
        });
        const data: { success: boolean; token: string } = await response.json();
        setIsLogin(data.success);

        if (data.success) {
            sessionStorage.setItem("token", data.token);
            navigate("/profile");
        }
    }

    return (
        <form className="login-form" onSubmit={(e: FormEvent) => login(e)}>
            <div className={isLogin === false ? "error-msg" : "toggle-visibility"}>
                Username or password is incorrect, please try again
            </div>
            <input
                type="text"
                name="login-username"
                id="login-username"
                placeholder="username"
                required
                onClick={() => setIsLogin(true)}
            />
            <input
                type="password"
                name="login-password"
                id="login-password"
                placeholder="password"
                required
            />
            <input type="submit" value="Log in" />
        </form>
    );
}

export default Login;
