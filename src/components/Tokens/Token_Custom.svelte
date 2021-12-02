<script>
    export let base64Image, type="svg+xml", alt="";
</script>


<img
    src="data:image/{type};base64, {base64Image}"
    alt={alt}
/>