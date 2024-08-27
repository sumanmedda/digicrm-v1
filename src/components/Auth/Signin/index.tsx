"use client";
import Link from "next/link";
import React from "react";
import SigninWithPassword from "../SigninWithPassword";
import { useState } from "react";
import SignUpWithPassword from "../SignUpWithPassword";

export default function Signin() {
  const [signUp, setToSignup] = useState(false);

  function switchSignup() {
    setToSignup(!signUp)
  }

  return (
    <>

      <div>
        {signUp ? <SignUpWithPassword />: <SigninWithPassword />}
        
      </div>

      <div className="mt-6 text-center">
        <p>
        {signUp ? 'Already have an account? ' : 'Don’t have any account? '}
          <button onClick={switchSignup} className="text-primary">
            {signUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </>
  );
}
