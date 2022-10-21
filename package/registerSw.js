;(async () => {
  try {
    await navigator.serviceWorker.register('{swDest}')
  } catch {}
})()
