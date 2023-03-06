// Function to get the frequency of the words
export const wordCountMap = (book) => {
  const titleWords = book.title.split(" ");
  const authorWords = book.author.split(/[\s,]+/);
  let categoryWords = book.category;
  // const descriptionWords = book.description.split(/[\s,]+/);

  // const allWords = [...titleWords, ...authorWords, ...categoryWords, ...descriptionWords];
  const allWords = [...titleWords, ...authorWords, ...categoryWords];
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

// Add the words to the dictionary
export const addWordsToDictionary = (wordCount, dict) => {
  for (let key in wordCount) {
    dict[key] = true;
  }
};

// Create a vector from the word maps
export const wordMapToVector = (map, dict) => {
  let wordCountVector = [];
  for (let term in dict) {
    wordCountVector.push(map[term] || 0);
  }
  return wordCountVector;
};

// Find the dot product of vectors
export const dotProduct = (vecA, vecB) => {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
};

// Find the magnitude of the vectors
export const magnitude = (vec) => {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
};

// Calculate the cosine similarity by using the formula
export const cosineSimilarity = (vecA, vecB) => {
  return dotProduct(vecA, vecB) / (magnitude(vecA) * magnitude(vecB));
};

// Get two books as an input and find their cosine similarity
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
