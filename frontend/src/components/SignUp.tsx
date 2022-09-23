import { useEffect, useState, ChangeEvent } from "react";
import { Account } from "../interface/interface";
import { handleInput } from "../interface/interface";

function SignUp() {
    const credentials: {
        username: string;
        password: string;
        email: string;
        isAdmin: boolean;
    } = {
        username: "",
        password: "",
        email: "",
        isAdmin: false,
    };
    const [account, setAccount] = useState<Account>(credentials);
    const [adminBtnChecked, setAdminBtnChecked] = useState<boolean>(false);
    const [displayWarning, setDisplayWarning] = useState<boolean>(false);
    const [signUpMsg, setSignUpMsg] = useState<string>("Create an account");

    function handleChange(e: handleInput) {
        setAccount({ ...account, [e.target.name]: e.target.value });
        console.log(typeof e);
    }

    async function createAccount(account: Account) {
        if (account.username !== "" && account.password !== "") {
            const response = await fetch("http://localhost:5555/api/signup", {
                method: "POST",
                body: JSON.stringify(account),
                headers: { "Content-Type": "application/json" },
            });
            const data: {
                success: boolean;
                usernameExists: boolean;
                emailExists: boolean;
            } = await response.json();

            data.success
                ? setSignUpMsg("You created a new account")
                : setSignUpMsg("Account already exists");
            data.success ? setDisplayWarning(false) : setDisplayWarning(true);
        } else {
            setSignUpMsg("Please enter username and password.");
            setDisplayWarning(true);
        }
    }

    useEffect(() => {
        setAccount({ ...account, isAdmin: adminBtnChecked });
    }, [adminBtnChecked]);

    return (
        <div id="sign-up">
            <div className={displayWarning ? "error-msg" : ""}>
                <p>{signUpMsg}</p>
            </div>
            <input
                type="text"
                placeholder="username"
                name="username"
                value={account?.username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            />
            <input
                type="email"
                placeholder="email"
                name="email"
                pattern="/(^$|^.*@.*\..*$)/"
                value={account?.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            />
            <input
                type="password"
                placeholder="password"
                name="password"
                value={account?.password}
                onChange={(e) => handleChange(e)}
            />
            <label htmlFor="isAdmin">
                Admin account
                <input
                    type="checkbox"
                    name="isAdmin"
                    id="isAdmin"
                    onChange={() => setAdminBtnChecked(!adminBtnChecked)}
                />
            </label>
            <button onClick={() => createAccount(account)}>Sign Up</button>
        </div>
    );
}

export default SignUp;
