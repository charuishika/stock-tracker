"use client";

export function toggleAuthMode(e) {
    e.preventDefault();
    const card = document.getElementById("authCard");
    const title = document.getElementById("cardTitle");
    const subtitle = document.getElementById("cardSubtitle");
    const btnText = document.getElementById("btnText");
    const switchText = document.getElementById("switchText");
    const switchLink = document.getElementById("switchLink");

    card.classList.add("fade-out");

    setTimeout(() => {
        const isLogin = title.textContent.includes("Login");

        if (isLogin) {
            title.textContent = "Create your Account";
            subtitle.textContent = "Get started with PortfoTrack today";
            btnText.textContent = "Sign up with Google";
            switchText.textContent = "Already registered? ";
            switchLink.textContent = "Login";
        } else {
            title.textContent = "Login to your Account";
            subtitle.textContent = "Welcome back! Sign in to continue";
            btnText.textContent = "Continue with Google";
            switchText.textContent = "Don't have an account? ";
            switchLink.textContent = "Sign Up";
        }

        card.classList.remove("fade-out");
    }, 300);
}

export function handleGoogleSignIn() {
    alert("Google login will be implemented next.");
}
