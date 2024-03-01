select * from users 
{#if param('limit', null)}
  limit {param('limit')}
{/if}
