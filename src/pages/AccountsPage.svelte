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
  <h2>
    Manage Accounts (Coming soon!)
  </h2>

  <Container>
    <Button
        color="primary"
        disabled={!$isSavingBtnEnabled}
        onClick={onSaveButtonClick}
    >
        Save
    </Button>
    </Container>
</Container>
