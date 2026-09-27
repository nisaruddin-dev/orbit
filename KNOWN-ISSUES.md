# Known Issues

## Aurora realtime

Realtime subscription connects and delivers events, but the
scene does not always update from them without a poll or focus
event. Polling (5s) and refetch-on-focus handle synchronization
instead. Deferred to Part 9 or later. Not blocking.

## Node appears after focus or poll

After creating a task, the node may not appear in the scene
until the window regains focus (a click) or the 5-second poll
interval elapses. Known limitation of the current sync setup.
Not blocking.
