---
"@latitude-data/server": patch
---

hotfix: client-side cache was not being invalidated after data changed. This
commit removes this cache for the time being, this results in a performance hit
but it's mostly unnoticeable given backend cache is still in place.
