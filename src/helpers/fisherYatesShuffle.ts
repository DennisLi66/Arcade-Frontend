function fisherYatesShuffle(arr:int[]) : int[]{
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
export default fisherYatesShuffle;
// /https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
