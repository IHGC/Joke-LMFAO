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

  const isOwner = (jokes,userid) =>{
    for(let i=0;i<jokes.length;i++){
      if(jokes[i].userId==userid){
        jokes[i].isowner=true;
      }
    }
    return jokes
  }

  module.exports={isRatedByUser,isOwner};

