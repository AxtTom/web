<script lang="ts">
    import { Link } from 'svelte-routing';
    import Cookies from '../lib/js.cookie.min.mjs';

    function register(e) {
        const formData = new FormData(e.target);
        
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        
        fetch('/api/auth', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: data.username,
                password: data.password,
                confirm: data.confirm
            })
        }).then(() => {
            location.href = '/login';
        });
    }
</script>

<form on:submit|preventDefault={register}>
    <input name="username" type="text" placeholder="Username">
    <input name="password" type="password" placeholder="Password">
    <input name="confirm" type="password" placeholder="Confirm">
    <input type="submit" value="Register">
    <Link to="/login">Login</Link>
</form>

<style>
    form {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    form input {
        width: 16em;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        margin-top: 4px;
        font-size: 1.2em;
    }
</style>