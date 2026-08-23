export async function callWithRetry(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const retryable = error.status == 429 || (error.status >= 500 && error.status < 600);
      const delay = 1000 * Math.pow(2 * attempt - 1);
      console.log(`تلاش ${attempt} ناموفق (${error.status}). ${delay}ms صبرمیکنیم ....`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}


