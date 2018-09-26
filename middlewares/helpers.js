const isRatedByUser = (jokes,userId) =>{
    for(let i=0;i<jokes.length;i++){
      for(let j=0;j<jokes[i].rates.length;j++){
        if(jokes[i].rates[j].userId==userId){
          jokes[i].isRated=jokes[i].rates[j].rate
        }
      }
    }
    return jokes
  }

  module.exports=isRatedByUser;

