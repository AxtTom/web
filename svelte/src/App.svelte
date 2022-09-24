<script lang="ts">
    import { Router, Link, Route } from 'svelte-routing';
    import Cookies from './lib/js.cookie.min.mjs';

    import logo from './assets/logo64.png';
    import account from './assets/account_circle_FILL0_wght400_GRAD0_opsz48.svg'

    import Home from './routes/Home.svelte';
    import Imprint from './routes/Imprint.svelte';
    import Privacy from './routes/Privacy.svelte';
    import Login from './routes/Login.svelte';
    import Register from './routes/Register.svelte';

    export let url = '';

    let name = '';
    if (Cookies.get('token')) fetch('/api/auth', {
        method: 'GET',
        headers: {
            'Authorization': Cookies.get('token')
        }
    }).then(res => res.json()).then(user => {
        name = user.displayName;
    });
</script>

<Router url="{url}">
    <div class="container">
        <div class="header-left">
            <Link to="/">
                <div class="link">
                    <img alt="Logo" src={logo} />
                    <span>AxtTom.de</span>
                </div>
            </Link>
        </div>
        <div class="header-right">
            {#if !name}
            <Link to="/login">
                <div class="link">
                    <span>Login</span>
                    <img alt="Account" src={account}/>
                </div>
            </Link>
            {:else}
            <Link to="/login">
                <div class="link">
                    <span>{name}</span>
                    <img alt="Account" src={account}/>
                </div>
            </Link>
            {/if}
        </div>
        <main>
            <Route path="/login" component="{Login}" />
            <Route path="/register" component="{Register}" />

            <Route path="/privacy" component="{Privacy}" />
            <Route path="/imprint" component="{Imprint}" />

            <Route path="/"><Home /></Route>
        </main>
        <footer>
            <Link to="/imprint">Imprint</Link>
            <Link to="/privacy">Privacy Policy</Link>
        </footer>
    </div>
</Router>

<style>
    .container {
        height: 100%;

        display: grid;
        grid-template-columns: 200px auto 200px;
        grid-template-rows: 2em auto 2em;
        grid-template-areas: 
            "left main right"
            ". main ."
            "footer footer footer"
        ;
    }
    @media only screen and (max-width: 900px) {
        .container {
            grid-template-columns: 50% 50%;
            grid-template-rows: 2em auto 2em;
            grid-template-areas: 
                "left right"
                "main main"
                "footer footer"
            ;
        }
    }
    footer {
        grid-area: footer;

        background-color: #0003;

        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    main {
        grid-area: main;
    }

    .header-left {
        grid-area: left;
        padding-left: 4px;
    }
    .header-left img {
        width: auto;
        height: 2em;
    }
    .header-left span {
        padding-left: 4px;
        color: #fffe;
        font-size: 1.2em;
    }
    .header-left .link {
        display: flex;
        align-items: center;
    }

    .header-right {
        grid-area: right;
        padding-right: 4px;
    }
    .header-right img {
        width: auto;
        height: 2em;
    }
    .header-right span {
        padding-right: 4px;
        color: #fffe;
        font-size: 1.2em;
    }
    .header-right .link {
        display: flex;
        align-items: center;
        justify-content: right;
    }
</style>