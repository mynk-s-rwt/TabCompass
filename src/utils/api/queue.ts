interface QueueItem {
  id: string;
  text: string;
  resolve: (embedding: number[] | null) => void;
  reject: (error: Error) => void;
}

class EmbeddingQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private requestsThisMinute = 0;
  private maxRequestsPerMinute = 15; // Gemini free tier limit

  async add(id: string, text: string): Promise<number[] | null> {
    return new Promise((resolve, reject) => {
      this.queue.push({ id, text, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      // Rate limiting: max 15 requests per minute
      if (this.requestsThisMinute >= this.maxRequestsPerMinute) {
        console.log('Rate limit reached, waiting 60s...');
        await this.sleep(60000);
        this.requestsThisMinute = 0;
      }

      const item = this.queue.shift()!;

      try {
        const { generateEmbedding } = await import('./gemini');
        const result = await generateEmbedding(item.text);

        if (result.success && result.data) {
          item.resolve(result.data);
          this.requestsThisMinute++;
        } else {
          item.reject(new Error(result.error || 'Unknown error'));
        }
      } catch (error) {
        item.reject(error as Error);
      }

      // Small delay between requests
      await this.sleep(100);
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clear(): void {
    this.queue = [];
  }

  size(): number {
    return this.queue.length;
  }
}

export const embeddingQueue = new EmbeddingQueue();
