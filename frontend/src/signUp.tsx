import { useState } from "react";
import { Account } from "./interface/interface";

function SignUp() {
  const credentials = {
    user: "",
    password: "",
    email: "",
  };
  const [account, setAccount] = useState<Account>(credentials);
  const [response, setResponse] = useState<Boolean>();

  function handleChange(e: any) {
    setAccount({ ...account, [e.target.name]: e.target.value });
  }

  async function createAccount(account: Account) {
    const response = await fetch("http://localhost:5555/api/signup", {
      method: "POST",
      body: JSON.stringify(account),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setResponse(await data.success);
  }
  return (
    <section id="signUp">
      {response === false ? (
        <p>Account already exists</p>
      ) : response === true ? (
        <p>You created a new account</p>
      ) : (
        <p>Add username and password to create an account</p>
      )}
      <input
        type="text"
        placeholder="username"
        name="user"
        value={account?.user}
        onChange={(e: any) => handleChange(e)}
      />
      <input
        type="email"
        placeholder="email"
        name="email"
        value={account?.email}
        onChange={(e: any) => handleChange(e)}
      />
      <input
        type="text"
        placeholder="password"
        name="password"
        value={account?.password}
        onChange={(e) => handleChange(e)}
      />
      <button onClick={() => createAccount(account)}>Sign Up</button>
    </section>
  );
}

export default SignUp;
