function millisecondsToReadableTime(timeInMilliseconds:number) : string{
  function extendToTwoSpaces(line:string) : string {
    var toReturn = line ? line : "00";
    while (toReturn.length <= 2){
      toReturn = '0' + toReturn;
    }
    return toReturn;
  }
  //first, milliseconds to seconds
  var seconds = timeInMilliseconds/1000;
  var minutes = 0;
  if (seconds > 60){
    minutes = Math.floor(seconds / 60)
    seconds = seconds % 60;
  }
  var hours = 0;
  if (minutes > 60){
    hours = Math.floor(seconds / 60)
    minutes = minutes % 60;
  }
  return hours.toString() + ':' + extendToTwoSpaces(minutes.toString()) + ':' + extendToTwoSpaces(seconds.toString().split(".")[0])
  + ':' + extendToTwoSpaces(seconds.toString().split(".")[1]);
}

export default millisecondsToReadableTime;
