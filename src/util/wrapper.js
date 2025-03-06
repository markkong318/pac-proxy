const CALL_COUNT = 32000;

export default async (createFindProxyAsync) => {
  let idx = 0;
  const promises = [createFindProxyAsync(), createFindProxyAsync()];

  let findProxy = await promises[idx];
  promises[idx] = createFindProxyAsync();

  let count = 0;
  return async (...args) => {
    if (count > CALL_COUNT) {
      idx ^= 1;
      findProxy = await promises[idx];
      promises[idx] = createFindProxyAsync();

      count = 0;
    }
    count++;
    return findProxy(...args);
  };
}
