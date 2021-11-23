<script>
    import Logo from '../Logos/LogoPhi.svelte'
</script>

<div class="flex row align-center container">
    <div class="flex align-center just-center nav-brand-logo">
        <Logo width="100%"/>
    </div>
    <div class="brand">
        My Lamden Wallet
    </div>
</div>

<style>
    div.brand {
    font-weight: bolder;
    }

    .nav-brand-logo {
        min-width: initial;
        color: var(--color-gray-4);
        width: 23px;
        margin-right: 10px;
    }

    @media screen and (min-width: 430px) {
        .nav-brand-logo {
            width: 35px;
        }
    }
</style>