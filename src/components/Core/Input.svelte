<script>
export let onClick, type="text", autoComplete="", value="", onEnterButton=null, label=null;
const submitOnEnter = (e) => {
    console.log(e.code);
    if (e.code === "Enter" || e.code === "NumpadEnter") {
        if (onEnterButton !== null) {
            e.preventDefault();
            e.stopPropagation();
            onEnterButton(e.target.value);
        }
    }
}
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
    on:keydown={submitOnEnter}
    />
</label>
{/if}