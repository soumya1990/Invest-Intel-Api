function MergeArray(arr1, arr2, key) {
  const mergedArr = [];
  const arr2Map = new Map(arr2.map((item) => [item[key], item]));

  for (const item of arr1) {
    // console.log(item);
    const keyVal = item[key];
    const matchItem = arr2Map.get(keyVal);
    if (matchItem) {
      const mergedItem = { ...item, ...matchItem };
      mergedArr.push(mergedItem);
    } else {
      mergedArr.push(item);
    }
  }
  return mergedArr;
}

module.exports = MergeArray;
