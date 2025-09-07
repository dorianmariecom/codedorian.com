dorian: quote

```
from = User.find!("dorian")
handles = ["dorian"]
open_ai_api_key = Datum.value!("open_ai_api_key")

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    messages: [
      { role: :system, content: "give me a random quote in french, only the quote" }
    ],
  }.to_json,
)

subject = "citation {Date.today}"
body = Json.parse(response.body).choices.first.message.content

handles.each do |handle|
  to = User.find(handle)
  next unless to

  message = Message.create!(from: from, to: to, subject: subject, body: body)

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :quote,
    collapse_key: :quote,
  )
end

subject
```

dorian: fact

```
from = User.find!("dorian")
handles = ["dorian"]
open_ai_api_key = Datum.value!("open_ai_api_key")

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    messages: [
      {
        role: :system,
        content: "give me a random fun fact in french"
      }
    ],
  }.to_json,
)

subject = "fait amusant {Date.today}"
body = Json.parse(response.body).choices.first.message.content

handles.each do |handle|
  to = User.find(handle)

  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body
  )

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :fact,
    collapse_key: :fact
  )
end

subject
```

vincent: reddit

```
from = User.find!("dorian")
handles = ["vincent"]
reddit_username = Datum.value!("reddit_username")
reddit_password = Datum.value!("reddit_password")
reddit_client_id = Datum.value!("reddit_client_id")
reddit_client_secret = Datum.value!("reddit_client_secret")
user_agent = "codedorian.com 1.0"
limit = 100
subreddits = [
  :france,
  :rance,
  :memesFR,
  :dinosaure,
  :memefrancais,
  :frenchmemes,
]
time = :day

token_response = Http.post(
  "https://www.reddit.com/api/v1/access_token",
  headers: { "user-agent": user_agent },
  username: reddit_client_id,
  password: reddit_client_secret,
  data: {
    grant_type: :password,
    username: reddit_username,
    password: reddit_password,
  },
)
token_body = token_response.body
token_json = Json.parse(token_body)
token = token_json.access_token

subreddits.each do |subreddit|
  subject = "reddit {subreddit} {Date.today}"
  subreddit_response = Http.get(
    "https://oauth.reddit.com/r/{subreddit}/top",
    headers: {
      "authorization": "bearer {token}",
      "user-agent": user_agent,
    },
    query: {
      limit: limit,
      t: time,
    },
  )
  subreddit_body = subreddit_response.body
  subreddit_json = Json.parse(subreddit_body)
  subreddit_children = subreddit_json&.data&.children
  subreddit_images = subreddit_children&.select do |subreddit_child|
    subreddit_child.dig(:data, :post_hint) == :image
  end
  reddit_posts = subreddit_images&.map(&:data)&.map do |subreddit_post|
    {
      title: subreddit_post.title,
      url: subreddit_post.url
    }
  end

  body = reddit_posts.map do |reddit_post|
    '
      <p>
        <a href="{reddit_post.url}">
          {reddit_post.title}
        </a>
      </p>

      <p>
        <a href="{reddit_post.url}">
          <img alt="{reddit_post.title}" src="{reddit_post.url}" />
        </a>
      </p>
    '
  end.join("<br>")

  handles.each do |handle|
    to = User.find(handle)

    next unless to

    message = Message.create!(
      from: from,
      to: to,
      subject: subject,
      body: body,
    )


    Notification.create!(
      from: from,
      to: to,
      subject: subject,
      path: "/users/{to.id}/messages/{message.id}/body",
      sound: :default,
      thread_id: :reddit,
      collapse_key: :reddit,
    )
  end
end

"reddit {Date.today}"

```

dorian: hn

```
from = User.find!("dorian")
handles = ["dorian"]
limit = 20
open_ai_api_key = Datum.value!("open_ai_api_key")

ids_response = Http.get("https://hacker-news.firebaseio.com/v0/topstories.json")
ids = Json.parse(ids_response.body).first(limit)

items = ids.map do |id|
  Json.parse(Http.get("https://hacker-news.firebaseio.com/v0/item/{id}.json").body)
end

subject = "hn {Date.today}"
body = items.map do |item|
  if item.url
    '<p><a href="{item.url}">{item.title}</a></p>'
  else
    '<p>{item.title}</p>'
  end
end.join

handles.each do |handle|
  to = User.find(handle)

  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
  )

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :hn,
    collapse_key: :hn,
  )
end

"hn {Date.today}"
```

dorian: joke

```
from = User.find!("dorian")
handles = ["dorian"]
open_ai_api_key = Datum.value!("open_ai_api_key")

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    messages: [
      { role: :system, content: "give me a random joke in french, only the joke" }
    ],
  }.to_json,
)

subject = "blague {Date.today}"
body = Json.parse(response.body).choices.first.message.content

handles.each do |handle|
  to = User.find(handle)
  next unless to

  message = Message.create!(from: from, to: to, subject: subject, body: body)

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :joke,
    collapse_key: :joke,
  )
end

subject
```

dorian: dictionary

```
from = User.find!("dorian")
handles = ["dorian"]
open_ai_api_key = Datum.value!("open_ai_api_key")

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "dictionary",
        schema: {
          type: "object",
          properties: {
            word: { type: "string" },
            definition: { type: "string" },
            example: { type: "string" }
          },
          required: ["word", "definition", "example"],
          additionalProperties: false
        }
      }
    },
    messages: [
      {
        role: :system,
        content: "give me a random word in french with its definition in french and an example sentence in french, no dot at the end"
      }
    ],
  }.to_json,
)

subject = "dictionary {Date.today}"
dictionary = Json.parse(Json.parse(response.body).choices.first.message.content)

notification_body = dictionary.word
message_body = "{dictionary.word}. {dictionary.definition}. {dictionary.example}."

handles.each do |handle|
  to = User.find(handle)
  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: message_body
  )

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: notification_body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :dictionary,
    collapse_key: :dictionary
  )
end

subject
```

dorian: pomodoro

```
from = User.find!("dorian")
handles = ["dorian"]

send! = (subject:) => {
  handles.each do |handle|
    to = User.find(handle)

    next unless to

    Notification.create!(
      from: from,
      to: to,
      subject: subject,
      sound: :default,
      thread_id: :pomodoro,
      collapse_key: :pomodoro,
    )
  end

  subject
}

if Time.hour >= 6 and Time.hour < 23
  if Time.minutes < 5
    send!(subject: "pomodoro start {Time.hour}:00")
  elsif Time.minutes >= 25 and Time.minutes < 30
    send!(subject: "pomodoro break {Time.hour}:25")
  elsif Time.minutes >= 30 and Time.minutes < 35
    send!(subject: "pomodoro start {Time.hour}:30")
  elsif Time.minutes >= 55
    send!(subject: "pomodoro break {Time.hour}:55")
  else
    "pomodoro {Time.now}"
  end
else
  "not pomodoro {Time.now}"
end

```

grandma: kto

```
from = User.find!("dorian")

handles = ["grandma"]

response = Http.get("https://www.ktotv.com/guide/")

page = Html.new(response.body)

elements = page.css("#tab{Date.today} .programming-scroll ul > li:has(.date)")

subject = "kto {Date.today}"
body = elements.map do |element|
  "{Time.new("{Date.today} {element.css(".date")}").format("%H:%M")}: {element.css("h5")}"
end.compact.join("<br>")

handles.each do |handle|
  to = User.find(handle)

  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
  )

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :kto,
    collapse_key: :kto,
  )
end

subject

```

workelo: hands

```
names = [
  :arthur,
  :baptiste,
  :dorian,
  :fabien,
  :marine,
  :mathieu,
  :vincent,
]

names = names.shuffle

subject = "all hands {Date.today}"
message = "{subject}\n\nfirst to be available:\n\n{names.join("\n")}"

slack_bot_user_oauth_token = Datum.value!("slack_bot_user_oauth_token")
slack_channel_id = Datum.value!("slack_channel_id_tech")

Http.post(
  "https://slack.com/api/chat.postMessage",
  headers: {
    "content-type": "application/json; charset=utf-8",
    "authorization": "Bearer {slack_bot_user_oauth_token}",
  },
  body: { channel: slack_channel_id, text: message }.to_json
)

subject
```

dorian: weather

```
from = User.find("dorian")
handles = ["dorian"]

address = "49 rue de grandvilliers, 60360 crèvecœur-le-grand"
google_geocoding_api_key = Datum.value!("google_geocoding_api_key")
open_weather_map_api_key = Datum.value!("open_weather_map_api_key")
open_ai_api_key = Datum.value!("open_ai_api_key")

geocoding_response = Http.get(
  "https://maps.googleapis.com/maps/api/geocode/json",
  query: {
    address: address,
    key: google_geocoding_api_key,
  },
)

location = Json.parse(geocoding_response.body).results.first.geometry.location

latitude = location.lat
longitude = location.lng

weather_response = Http.get(
  "https://api.openweathermap.org/data/3.0/onecall/overview",
  query: {
    lat: latitude,
    lon: longitude,
    appid: open_weather_map_api_key,
    units: :metric,
  },
)

overview = Json.parse(weather_response.body).weather_overview

ai_response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    messages: [
      {
        role: :system,
        content: 'summarize and translate the following weather overview for {address}',
      },
      {
        role: :user,
        content: overview,
      },
      {
        role: :system,
        content: 'everything in french and short',
      },
    ],
  }.to_json,
)

subject = "météo {Date.today}"
body = Json.parse(ai_response.body).choices.first.message.content

handles.each do |handle|
  to = User.find(handle)

  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
  )

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :weather,
    collapse_key: :weather,
  )
end

subject
```

dorian: news

```
from = User.find!(:dorian)
handles = [:dorian]
countries = [:fr, :us]
news_api_key = Datum.value!(:news_api_key)
limit = 20

countries.each do |country|
  response = Http.get(
    "https://newsapi.org/v2/top-headlines",
    headers: { "x-api-key": news_api_key },
    query: {
      country: country,
      pageSize: limit,
    },
  )

  json = Json.parse(response.body)
  articles = json.articles

  subject = "news {country} {Date.today}"

  body = articles.map do |article|
    title = article.title
    url = article.url
    image = article.urlToImage
    source = article.source.name

    '
      <p>
        <a href="{url}">{title}</a>
        <br>
        <small>{source}</small>
      </p>
      {image ? '<p><a href="{url}"><img src="{image}" /></a></p>' : ""}
    '
  end.join("<br>")

  handles.each do |handle|
    to = User.find(handle)
    next unless to

    message = Message.create!(
      from: from,
      to: to,
      subject: subject,
      body: body,
    )

    Notification.create!(
      from: from,
      to: to,
      subject: subject,
      path: "/users/{to.id}/messages/{message.id}/body",
      sound: :default,
      thread_id: :news,
      collapse_key: :news,
    )
  end
end

"news {Date.today}"
```

vincent: google

```
from = User.find!("dorian")
handles = ["vincent"]
serp_api_key = Datum.value!("serp_api_key")

suffixes = [
  "",
  :absurde,
  :beauf,
  :bouseux,
  :gras,
  :lourd,
  :lourdingue,
  :noir,
  :potache,
  :vache,
]

suffixes.each do |suffix|
  if suffix == ""
    q = "humour"
  else
    q = "humour {suffix}"
  end

  subject = "google {q} {Date.today}"

  search_response = Http.get(
    "https://serpapi.com/search.json",
    query: {
      q: 'humour {q} {(1..100_000).sample}',
      engine: :google_images,
      api_key: serp_api_key,
      hl: :fr
    },
  )

  search_body = search_response.body
  search_json = Json.parse(search_body)
  search_images_results = search_json.images_results

  body = search_images_results.map do |search_image_result|
    '
      <p>
        <a href="{search_image_result.link}">
          {search_image_result.title}
        </a>
      </p>

      <p>
        <a href="{search_image_result.link}">
          <img
            alt="{search_image_result.title}"
            src="{search_image_result.thumbnail}"
          />
        </a>
      </p>
    '
  end.join("<br>")

  handles.each do |handle|
    to = User.find(handle)

    next unless to

    message = Message.create!(
      from: from,
      to: to,
      subject: subject,
      body: body,
    )

    Notification.create!(
      from: from,
      to: to,
      subject: subject,
      path: "/users/{to.id}/messages/{message.id}/body",
      sound: :default,
      thread_id: :google,
      collapse_key: :google,
    )
  end
end

"google {Date.today}"
```

mom: day

```
from = User.find!("dorian")
handles = ["mom"]
day = Date.today.to_string
open_ai_api_key = Datum.value!("open_ai_api_key")

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    messages: [
      { role: :system, content: 'give me the "day of ..." in french for france' },
      { role: :user, content: "today is {day}" },
      { role: :system, content: "examples: international women's day, international pi day, bastille day, halloween, mother's day" },
    ],
  }.to_json,
)

subject = "journée du {day}"
body = Json.parse(response.body).choices.first.message.content

handles.each do |handle|
  to = User.find(handle)

  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
  )


  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :day,
    collapse_key: :day,
  )
end

subject
```

workelo: daily

```
names = [
  :alex,
  :arthur,
  :baptiste,
  :dorian,
  :fabien,
  :louis,
  :marine,
  :mathieu,
  :simon,
  :vincent,
]

names = names.shuffle

subject = "daily {Date.today}"
message = "{subject}\n\n{names.join("\n")}"

slack_bot_user_oauth_token = Datum.value!("slack_bot_user_oauth_token")
slack_channel_id = Datum.value!("slack_channel_id_product_tech")

if Time.monday? or Time.tuesday? or Time.wednesday? or Time.thursday? or Time.friday?
  Http.post(
    "https://slack.com/api/chat.postMessage",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "authorization": "Bearer {slack_bot_user_oauth_token}",
    },
    body: { channel: slack_channel_id, text: message }.to_json
  )
end

subject
```

vincent: twitter

```
from = User.find!("dorian")
handles = ["vincent"]
subject = "twitter humour {Date.today}"
max_results = 20
twitter_api_key = Datum.value!("twitter_api_key")
twitter_api_key_secret = Datum.value!("twitter_api_key_secret")
query = "(humour OR drôle OR marrant) lang:fr has:images -is:retweet -is:reply"

token_response = Http.post(
  "https://api.twitter.com/oauth2/token",
  username: twitter_api_key,
  password: twitter_api_key_secret,
  query: { grant_type: :client_credentials }
)

token_body = token_response.body
token_json = Json.parse(token_body)

twitter_access_token = token_json.access_token

search_response = Http.get(
  "https://api.twitter.com/2/tweets/search/recent",
  headers: {
    authorization: "Bearer {twitter_access_token}"
  },
  query: {
    query: query,
    "tweet.fields": "id,text,lang,created_at,attachments",
    "expansions": "attachments.media_keys",
    "media.fields": "media_key,type,url,preview_image_url",
    max_results: max_results
  }
)

search_body = search_response.body
search_json = Json.parse(search_body)

body = search_json.data.map do |tweet|
  media_keys = tweet.dig(:attachments, :media_keys)
  media = search_json.includes.media

  next unless media_keys

  media = media_keys.map { |media_key| media.detect { |media| media.media_key == media_key } }.compact
  urls = media.map { |media| media[:url] or media[:preview_image_url] }.compact

  next if urls.none?

  '
    <p>{tweet.text}</p>

    {urls.map { |url| '<p><a href="{url}"><img src="{url}" /></a></p>' }.join}
  '
end.join

handles.each do |handle|
  to = User.find(handle)

  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
  )


  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :twitter,
    collapse_key: :twitter,
  )
end

subject
```

marie-odile: positive

```
from = User.find!("dorian")
handles = ["marie-odile"]
day = Date.today.to_string
open_ai_api_key = Datum.value!("open_ai_api_key")

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    messages: [
      { role: :system, content: "give me a random positive sentence in french, without quotes, without authors, just the sentence" },
    ],
  }.to_json,
)

subject = "phrase positive {day}"
body = Json.parse(response.body).choices.first.message.content

handles.each do |handle|
  to = User.find(handle)

  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
  )

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :positive,
    collapse_key: :positive,
  )
end

subject
```

vincent: questions

```
from = User.find!("dorian")
handles = ["vincent", "dorian"]
open_ai_api_key = Datum.value!("open_ai_api_key")
limit = 10

questions_response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-4o",
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "questions",
        schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              minItems: limit,
              maxItems: limit,
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" }
                },
                required: ["question", "answer"],
                additionalProperties: false
              }
            }
          },
          required: ["questions"],
          additionalProperties: false
        }
      }
    },
    messages: [
      { role: :system, content: "give me a json of {limit} random difficult questions and with one word answers, in french" },
    ],
  }.to_json,
)

questions = Json.parse(Json.parse(questions_response.body).choices.first.message.content).questions

questions_subject = "questions {Date.today}"
answers_subject = "réponses {Date.today}"

questions_body = questions.map do |question|
  "<p>{question.question}</p>"
end.join("\n")

answers_body = questions.map do |question|
  "<p>{question.question} {question.answer}</p>"
end.join("\n")

handles.each do |handle|
  to = User.find(handle)

  next unless to

  questions_message = Message.create!(
    from: from,
    to: to,
    subject: questions_subject,
    body: questions_body,
  )

  Message.create!(
    from: from,
    to: to,
    subject: answers_subject,
    body: answers_body,
  )

  Notification.create!(
    from: from,
    to: to,
    subject: questions_subject,
    path: "/users/{to.id}/messages/{questions_message.id}/body",
    sound: :default,
    thread_id: :questions,
    collapse_key: :questions,
  )
end

questions_subject
```

dorian: birthdays

```
from = User.find!("dorian")

birthdays = Datum.value!("birthdays")
birthdays_to_users = Datum.value!("birthdays_to_users")

birthdays_to_users.each do |handle, names|
  to = User.find(handle)

  next unless to

  names.each do |name|
    birthday = birthdays[name]

    next unless birthday

    birthday = Date.new(birthday)
    birthday_this_year = birthday.change(year: Date.year)

    if birthday_this_year == Date.today
      age = Date.year - birthday.year
      age_string = age == 1 ? "1 an" : "{age} ans"

      subject = "c'est l'anniversaire de {name} : {age_string}"
      body = "la date de naissance est {birthday}"

      message = Message.create!(
        from: from,
        to: to,
        subject: subject,
        body: body,
      )

      Notification.create!(
        from: from,
        to: to,
        subject: subject,
        body: body,
        path: "/users/{to.id}/messages/{message.id}/body",
        sound: :default,
        thread_id: :birthdays,
        collapse_key: :birthdays,
      )
    end
  end
end

"birthdays {Date.today}"
```

dorian: quote

```
from = User.find!("dorian")
handles = ["dorian"]
open_ai_api_key = Datum.value!("open_ai_api_key")

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    messages: [
      { role: :system, content: "give me a random motivational quote in french, just the quote" }
    ],
  }.to_json,
)

subject = "citation {Date.today}"
body = Json.parse(response.body).choices.first.message.content

handles.each do |handle|
  to = User.find(handle)
  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body
  )

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :quote,
    collapse_key: :quote
  )
end

subject
```

dorian: history

```
from = User.find!("dorian")
handles = ["dorian"]
open_ai_api_key = Datum.value!("open_ai_api_key")

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-5",
    messages: [
      {
        role: :system,
        content: "provide a concise historical fact for the date {Date.today} in french"
      }
    ],
  }.to_json,
)

subject = "history {Date.today}"
body = Json.parse(response.body).choices.first.message.content

handles.each do |handle|
  to = User.find(handle)

  next unless to

  message = Message.create!(
    from: from,
    to: to,
    subject: subject,
    body: body
  )

  Notification.create!(
    from: from,
    to: to,
    subject: subject,
    body: body,
    path: "/users/{to.id}/messages/{message.id}/body",
    sound: :default,
    thread_id: :history,
    collapse_key: :history
  )
end

subject
```
