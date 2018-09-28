  $('.rateStars').rateYo({
    starWidth: "28px",
    normalFill: "gray",
    ratedFill: "black",
    precision: .1  ,
    maxValue: 5,
    minValue: 0,
    rating: this.dataset||0
  }).on("rateyo.set",(e,data)=>{
    console.log($(e.target).prev())
    const {origin}=window.location
    const id=e.target.dataset.jokeId
    const rate=data.rating
    console.log(id,e.target.dataset)
    axios.post(`${origin}/rate/${id}`,{rate})
    .then(r=>{
      console.log($(e.target).parent().parent().parent().find('.rateAvg'))
      $(e.target).parent().parent().parent().find('.rateAvg').text(r.data.rate)
      $(e.target).parent().find('.rate').text(rate)
      console.log(r)
     
    }).catch(e=>{
      console.log(e);
      alert(e)
    })
  })

