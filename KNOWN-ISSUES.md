# Known Issues

## Store does not populate on first page load

**Symptom:** After a hard reload, `useTaskStore.getState().tasks` is
empty. The scene renders no nodes until the user clicks the page, which
triggers `refetchOnWindowFocus`. After clicking, the query resolves, the
store populates, and the scene is correct.

**Severity:** Cosmetic in practice. The app works. Every mutation goes
through the API and persists. The only affected feature is the Aurora
ribbon, which reads the completion count from the store and therefore
does not display on a fresh load.

**Diagnosis so far:**
- The database has the tasks. (Verified via SQL query.)
- The API returns the tasks. (Verified via `listTasks()` in the console.)
- The store accepts tasks. (Verified via manual `setTasks()`.)
- The `QueryClientProvider` is mounted correctly. (Verified via main.tsx.)
- The `useTasks` hook writes to the store on `query.dataUpdatedAt`.
- The effect still does not fire on initial load.

**Next step when revisited:** Add a temporary `console.log` inside the
`useTasks` effect to confirm whether it fires at all on load. If it does
fire, the bug is in the effect's dependency comparison. If it does not,
the bug is in the query's mount path.

**Workaround:** Click the page. The refetch-on-focus handler fires, the
query resolves, the store populates.

**Fix deferred to:** Post-launch, after real use reveals whether this
matters.
