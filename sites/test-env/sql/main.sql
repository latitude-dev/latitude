{@const authenticated = run_query('user_auth').rows.length}
{#if cast(authenticated, 'boolean')}
    {ref('user_data')}
{/if}