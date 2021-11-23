<script>
import Button from '../components/Core/Button.svelte';
import Container from '../components/Core/Container.svelte';
import { navigateHome } from '../utils/navigation-utils'
import { writable } from 'svelte/store'

const isSavingBtnEnabled = writable(false);

const onSaveButtonClick = () => {
  // do nothing
}

</script>


<Container>
  <h3>
    Manage Settings (Coming soon!)
  </h3>

  <Container>
    <Button color="cancel" onClick={navigateHome}>Cancel</Button>
    <Button
        color="primary"
        disabled={!$isSavingBtnEnabled}
        onClick={onSaveButtonClick}
    >
        Save
    </Button>
    </Container>
</Container>
