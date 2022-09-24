<script lang="ts">
    import { Link } from 'svelte-routing';
    import Cookies from '../lib/js.cookie.min.mjs';

    let error = '';
    let usernameError = false;
    let passwordError = false;

    function validate(e) {
        error = '';
        usernameError = false;
        passwordError = false;

        const formData = new FormData(e.target);
        
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }

        if (!data.username || data.username == '') {
            usernameError = true;
            return false;
        }

        return true;
    }

    function login(e) {
        if (!validate(e)) return;

        const formData = new FormData(e.target);
        const data = {};
        for (let field of formData) {
            const [key, value] = field;
            data[key] = value;
        }
        
        fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                method: 'password',
                username: data.username,
                password: data.password
            })
        }).then(res => { 
            if (res.status == 200) res.json().then(token => {
                console.log(token);
                Cookies.set('token', token.token, { expires: 7, path: '/' });
                location.href = '/';
            });
            else if (res.status == 404) {
                error = 'Kein Benutzer mit diesem Namen';
            }
            else if (res.status == 401) {
                error = 'Falsches Passwort';
            }
            else {
                error = 'Fehler bei der Anmeldung';
            }
        });
    }
</script>

<form class="login" on:submit|preventDefault={login} on:forminput={validate}>
    <input name="username" type="text" placeholder="Username" class="{usernameError ? 'error' : ''}">
    <input name="password" type="password" placeholder="Password">
    <input type="submit" value="Login">
    <Link to="/register">Register</Link>
    <span style="color: red;">{error}</span>
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
    .error {
        color: red;
    }
</style>