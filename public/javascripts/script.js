  $('.rateStars').rateYo({
    starWidth: "28px",
    normalFill: "gray",
    ratedFill: "#f39c12",
    precision: .5,
    maxValue: 5,
    minValue: 0,
    rating: 0
  }).on("rateyo.set",(e,data)=>{
    console.log($(e.target).prev())
    const {origin}=window.location
    const id=e.target.dataset.jokeId
    const rate=data.rating
    axios.post(`${origin}/rate/${id}`,{rate})
    .then(r=>{
      $(e.target).prev().text(r.data.rate)
      console.log(this)
      console.log(r)
    }).catch(e=>{
      console.log(e);
      alert(e)
    })
  })

