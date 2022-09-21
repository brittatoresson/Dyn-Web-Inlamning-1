import React from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

function AccountPage() {
    return (
        <section>
            <SignUp />
            <Login />
        </section>
    );
}

export default AccountPage;
