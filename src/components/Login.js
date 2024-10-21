import React from 'react';

function Login() {
  return (
    <form>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Pin code" />
      <button type="submit">Login</button>
      <button>Login with Google</button>
    </form>
  );
}

export default Login;