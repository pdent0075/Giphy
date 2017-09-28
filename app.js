var coolStuff = ['snakes', 'frogs', 'lizzards', 'elephant', 'eagles']
var globalLimit = 10

function queryGiphy(search, limit) {
  var apiKey = 'HYy4hYRKYLWGYPS4YPYKq29BL0Y7Cy5e'
  var url = 'https://api.giphy.com/v1/gifs/search?' + $.param({
    q: search,
    limit: limit,
    api_key: apiKey
  })

  return $.get(url)
}

function extractImagesAndRatings(giphyResponse) {
  var data = giphyResponse.data

  return  data.reduce(function (acc, val) {
    
    return acc.concat({
      still: val.images.fixed_height_still.url ,
      animated:val.images.fixed_height.url ,
      rating: val.rating
    })
  }, [])
}

function makeButtons(topics) {
  $('#topic-buttons').empty()
  topics.forEach(function (topic) {
    var button =  $('<button>')
        .text(topic)
        .attr('data-topic', topic)
        .addClass('button')
        .on('click', handleClick)
    $('#topic-buttons').append(button)
  })
}

function makeSearch(){
  var form = $('<form>').addClass('search')

  var input = $('<input>')
      .attr('type', 'text')
      .appendTo($(form))

  var submit = $('<input>')
      .attr('type', 'submit')
      .val('search')
      .appendTo($(form))
      .on('click', function (e){
        e.preventDefault()
        var text = $(input).val()
        coolStuff.push(text)
        makeButtons(coolStuff)
        $(input).val('')
      })

  $('#topic-buttons').after($(form))
}

function handleClick() {
  $('#images').empty()
  var topic = $(this).attr('data-topic')

  queryGiphy(topic, globalLimit)
    .done(makeImageCards)
}

function makeImageCards(res) {
  
  var images = extractImagesAndRatings(res)

  images.forEach(function (image) {
    var holder = $('<div>').addClass('card')
    var rating = $('<p>').text('Rating: ' + image.rating.toUpperCase()).addClass('rating')
    var pic = $('<img>').attr('src', image.still).addClass('image')

    $(pic).on('click', image , animate)

    $(holder).append(rating).append(pic)
    $('#images').append(holder)
  })
}

function animate(e) {
  
  var image = e.data
  if ($(this).attr('src') === image.still) {
    $(this).attr('src', image.animated)
  } else {
    $(this).attr('src', image.still)
  }
}

makeButtons(coolStuff)
makeSearch()