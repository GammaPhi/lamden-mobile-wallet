<script>
    export let onClick, type="text", autoComplete="", value="", label=null;
</script>

<style>

</style>

{#if label === null}
<input
type={type}
autoComplete={autoComplete}
value={value}
on:change={(e) => onClick(e.target.value)}
on:input={(e) => onClick(e.target.value)}
/>
{:else}
<label>
    {label}
    <br/>
    <input
    type={type}
    autoComplete={autoComplete}
    value={value}
    on:change={(e) => onClick(e.target.value)}
    on:input={(e) => onClick(e.target.value)}
    />
</label>
{/if}