<script>
    export let base64Image, type="svg+xml", alt="";
</script>

<style>
img.image-icon {
    width: 100%;
    height: 100%;
}
</style>
<img
    class="image-icon"
    src="data:image/{type};base64, {base64Image}"
    alt={alt}
/>