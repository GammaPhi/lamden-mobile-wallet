<script>
import Button from '../components/Core/Button.svelte';
import Container from '../components/Core/Container.svelte';
import { navigateHome } from '../utils/navigation-utils'
import { writable } from 'svelte/store'
import { onMount } from 'svelte';
import { addOrUpdateConnection, getConnections, isAutoApproved, removeConnection } from '../utils/wallet-seed';
import Input from '../components/Core/Input.svelte';


let connections = writable([]);
let newConnection = writable('');

onMount(() => {
  updateConnections();
});

const updateConnections = () => {
  connections.set(getConnections());
}

const onAddConnection = () => {
  if ($newConnection.length > 0) {
    addOrUpdateConnection($newConnection, false);
    newConnection.set('');
    updateConnections();
  }
}

const onRemoveConnection = (origin) => {
  removeConnection(origin);
  updateConnections();
}

</script>

<style>
    .remove {
      cursor: pointer;
      color: red;
      font-weight: bold;
    }
    table {
      background: var(--bg-primary);
    }
</style>

<Container>
  <h2>
    Manage Connections
  </h2>

  <Container>
    <table>
      <thead>
        <tr>
          <th>Origin</th>
          <th>Auto Approval?</th>
          <th>Remove</th>
        </tr>
      </thead>
      {#each $connections as con}
      <tr>
        <td>
            <a href={con.name} target="_blank">{con.name}</a>
        </td>
        <td>
          <input
              type="checkbox"
              checked={isAutoApproved(con.name)}
              on:change={(e) => addOrUpdateConnection(con.name, e.target.checked)}
          />
        </td>
        <td>
          <div
            class="remove"
            on:click={()=>onRemoveConnection(con.name)}
          >
          X
          </div>
        </td>
      </tr>
      {/each}
    </table>
  </Container>

  <Container>
    <h3>Add Connection</h3>
    <Input 
      label="Origin"
      onClick={newConnection.set}      
      value={$newConnection}
      onEnterButton={onAddConnection}
    />
    <Button 
      color="primary"
      onClick={onAddConnection}
      disabled={$newConnection.length===0}
    >
      Add
    </Button>
  </Container>

</Container>
