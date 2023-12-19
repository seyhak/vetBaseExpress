function withTimeout(promise: Promise<any>, timeoutMs: number = 60 * 1000) {
  // Create a promise that rejects after the specified timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Promise timed out after ${timeoutMs} milliseconds`))
    }, timeoutMs)
  })

  // Use Promise.race to race the original promise and the timeout promise
  return Promise.race([promise, timeoutPromise])
}

export default withTimeout
