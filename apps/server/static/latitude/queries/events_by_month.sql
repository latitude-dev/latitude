{result = runQuery('unique_events')}

SELECT
  TO_CHAR(DATE_TRUNC('month', created_at), 'MM/YYYY') AS month,
  COUNT(event_type) AS events_total,
  {#each result as row, index}
    {#if index > 0}, {/if}

    COUNT(*) FILTER (WHERE event_type = {row.event_type}) AS pivot_{interpolate(index)}_count
  {/each}
FROM
  event_store_events
GROUP BY
  month
ORDER BY
  month
