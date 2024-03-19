with t1 as (
    select main_country,
           count(*) as count
    from { ref('titles/titles') }
    where clean_countries[1] != ''
    group by 1
    order by 2 desc
    limit 10
)
select *
from t1
order by 2 asc