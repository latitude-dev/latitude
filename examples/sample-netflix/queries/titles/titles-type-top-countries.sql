with t1 as(
    select main_country,
           count(*) as total,
           sum(case when type = 'MOVIE' then 1 else null end) as movie,
           sum(case when type = 'SHOW' then 1 else null end) as show
    from {ref('titles/titles')}
    where clean_countries[1] != ''
    group by 1
    order by 2 desc
    limit 5
)
select main_country,
       round(movie * 100.0 / total, 2) as movie_rate,
       round(show * 100.0 / total, 2) as show_rate
from t1
order by show_rate desc