export default function queue() {
  const store: any[] = [];

  return {
    enqueue(data: any) {
      store.push(data);
    },

    dequeue() {
      return store.shift();
    },

    get empty() {
      return store.length === 0;
    },
  };
}
