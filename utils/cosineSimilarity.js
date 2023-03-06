// Function to get the frequency of the words
export const wordCountMap = (book) => {
  const titleWords = book.title.split(" ");
  const authorWords = book.author.split(/[\s,]+/);
  let categoryWords = book.category;
  const descriptionWords = book.description.split(/[\s,]+/);

  const allWords = [...titleWords, ...authorWords, ...categoryWords, ...descriptionWords];
  if (book.maturity) {
    allWords.push(book.maturity);
  }
  if (book.publisher) {
    allWords.push(book.publisher);
  }

  let wordCount = {};

  allWords.forEach((w) => (wordCount[w] = (wordCount[w] || 0) + 1));

  return wordCount;
};

export const addWordsToDictionary = (wordCount, dict) => {
  for (let key in wordCount) {
    dict[key] = true;
  }
};

export const wordMapToVector = (map, dict) => {
  let wordCountVector = [];
  for (let term in dict) {
    wordCountVector.push(map[term] || 0);
  }
  return wordCountVector;
};

export const dotProduct = (vecA, vecB) => {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
};

export const magnitude = (vec) => {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
};

export const cosineSimilarity = (vecA, vecB) => {
  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
};

export const booksCosineSimilarity = (bookA, bookB) => {
  const wordCountA = wordCountMap(bookA);
  const wordCountB = wordCountMap(bookB);
  let dict = {};
  addWordsToDictionary(wordCountA, dict);
  addWordsToDictionary(wordCountB, dict);
  const vectorA = wordMapToVector(wordCountA, dict);
  const vectorB = wordMapToVector(wordCountB, dict);
  return cosineSimilarity(vectorA, vectorB);
};
