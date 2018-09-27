const isRatedByUser = (jokes, userId) => {
  for (let i = 0; i < jokes.length; i++) {
    for (let j = 0; j < jokes[i].rates.length; j++) {
      if (jokes[i].rates[j].userId == userId) {
        jokes[i].isRated = jokes[i].rates[j].rate;
      }
    }
  }
  return jokes;
};

const addMarkTag = (jokes, search) => {
  const regexp = new RegExp(`(${search})`, "gi");
  const usersMatched = [];
  for (let i = 0; i < jokes.length; i++) {
    jokes[i].body = jokes[i].body.replace(regexp, `<u>$1</u>`);
    if (!usersMatched.includes(jokes[i].userId)) {
      usersMatched.push(jokes[i].userId);
      jokes[i].userId.username = jokes[i].userId.username.replace(regexp,`<u>$1</u>`);
    }
  }
  return jokes;
};

const isOwner = (jokes, userId) => {
  for (let i = 0; i < jokes.length; i++) {
    let jokeId=(jokes[i].userId.username)?jokes[i].userId.id:jokes[i].userId
    if (jokeId == userId) {
      jokes[i].isOwner = true;
    }
  }
  return jokes;
};

module.exports = { isRatedByUser, isOwner, addMarkTag };
