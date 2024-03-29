function millisecondsToReadableTime(timeInMilliseconds:number) : string{
  function extendToTwoSpaces(line:string) : string {
    var toReturn = line ? line : "00";
    while (toReturn.length < 2){
      toReturn = '0' + toReturn;
    }
    return toReturn;
  }
  //FIX THIS MAKE IT LOOK PRETTIER
  //first, milliseconds to seconds
  //console.log("Final Time: " + timeInMilliseconds + " milliseconds.")
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
  //console.log("Hour: " + hours + " Minutes: " + minutes + " Seconds: " + seconds) // + " Milliseconds: " +seconds.toString().split(".")[1]);
  return hours.toString() + ':' + extendToTwoSpaces(minutes.toString()) + ':' + extendToTwoSpaces(seconds.toString().split(".")[0])
  + ':' + extendToTwoSpaces(seconds.toString().split(".")[1]);
}

export default millisecondsToReadableTime;
