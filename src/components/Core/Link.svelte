<script>
export let onClick;
</script>

<style>

</style>

<a href="/#" on:click={(e)=>{e.preventDefault(); onClick(e);}}><slot></slot></a>