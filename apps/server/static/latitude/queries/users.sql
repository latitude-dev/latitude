SELECT * 
FROM {ref('base/users')} as foo
{#if param('id', null)}
  WHERE id = {param('id')}
{/if}
