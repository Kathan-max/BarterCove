import React from "react";

function SignUp(){
    return (
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Pin code" />
          <button type="submit">Sign Up</button>
          <button>Sign up with Google</button>
        </form>
      );
}

export default SignUp;