import Cookies from 'universal-cookie';

function cookieSetter(dictionary){
  //Passables include gameID, score, and timeInMilliseconds
  console.log(dictionary);
  const cookies = new Cookies();
  cookies.set("redirect","LoginGame");
  cookies.set("gameID", dictionary['gameID']);
  if (dictionary['timeInMilliseconds']) cookies.set("timeInMilliseconds",dictionary['timeInMilliseconds'])
  if (dictionary['score']) cookies.set("score",dictionary['score']);
  window.location.reload();
}
export default cookieSetter;
