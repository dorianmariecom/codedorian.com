daily

```
names = [
  :alex,
  :arthur,
  :baptiste,
  :dorian,
  :fabien,
  :louis,
  :mathieu,
  :michel,
  :simon,
  :vincent,
]

names = names.shuffle

message = "daily {Date.today}\n\n{names.join("\n")}"

slack_app_id = "..."
slack_client_id = "..."
slack_client_secret = "..."
slack_signing_secret = "..."
slack_verification_token = "..."
slack_bot_user_oauth_token = "..."
# slack_channel_id = "..." # tech
slack_channel_id = "..." # product-tech
# slack_channel_id = "..." # dorianlog
slack_team_id = "..."

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

Date.today
```

kto

```
from = User.find!("dorian")

handles = ["grandma", "dorian"]

response = Http.get("https://www.ktotv.com/guide/")

page = Html.new(response.body)

elements = page.css("#tab{Date.today} .programming-scroll ul > li:has(.date)")

subject = "kto {Date.today}"
body = elements.map do |element|
  "{Time.new(element.css(".date")).format("%H:%M")}: {element.css("h5")}"
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
  )
end

subject
```

day

```
from = User.find!("dorian")
handles = ["mom", "dorian"]
day = Date.today.to_string
open_ai_api_key = "..."

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-4o",
    messages: [
      { role: :system, content: 'répond avec la "journée de" pour la date donnée' },
      { role: :user, content: "la date est {day}" },
      { role: :system, content: 'exemples: journée de la femme, journée de la marmotte' },
      { role: :system, content: 'sépare les "journée de" par un "<br>" entre chaque ligne si il y en a plusieurs' },
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
  )
end

subject
```

google

```
from = User.find!("dorian")
handles = ["vincent", "dorian"]
subject = "google images humour {Date.today}"
serp_api_key = "..."

search_response = Http.get(
  "https://serpapi.com/search.json",
  query: { q: 'humour "français" {(1..10_000).sample}', engine: :google_images, api_key: serp_api_key, hl: :fr },
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
        <img alt="{search_image_result.title}" src="{search_image_result.thumbnail}" />
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
  )
end

subject
```

humor:

```
from = User.find!("dorian")
handles = ["laetitia", "dorian"]
subject = "humour {Date.today}"
reddit_username = "..."
reddit_password = "..."
reddit_client_id = "..."
reddit_client_secret = "...
user_agent = "codedorian.com 1.0"
subreddits = [:dinosaure]
limit_per_subreddit = 20
limit_for_subreddits = 100

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

reddit_posts = subreddits.map do |subreddit|
  subreddit_response = Http.get(
    "https://oauth.reddit.com/r/{subreddit}/new",
    headers: {
      "authorization": "bearer {token}",
      "user-agent": user_agent,
    }
  )
  subreddit_body = subreddit_response.body
  subreddit_json = Json.parse(subreddit_body)
  subreddit_children = subreddit_json&.data&.children
  subreddit_images = subreddit_children&.select do |subreddit_child|
    subreddit_child.dig(:data, :post_hint) == :image
  end
  subreddit_images&.map(&:data)&.map do |subreddit_post|
    {
      title: subreddit_post.title,
      url: subreddit_post.url
    }
  end&.first(limit_per_subreddit)
end.compact.flatten.first(limit_for_subreddits)

body = reddit_posts.map do |reddit_post|
  '
    <p>
      {reddit_post.title}
    </p>

    <p>
      <img alt="{reddit_post.title}" src="{reddit_post.url}" />
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
  )
end

subject
```

positive

```
from = User.find!("dorian")
handles = ["marie-odile", "dorian"]
day = Date.today.to_string
open_ai_api_key = "..."

response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-4o",
    messages: [
      { role: :system, content: 'choisis un thème au hasard' },
      { role: :system, content: 'donne moi une phrase positive au hasard sur ce thème' },
      { role: :system, content: 'sans guillemets, sans auteurs, juste la phrase' },
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
  )
end

subject
```

reddit

```
from = User.find!("dorian")
handles = ["vincent", "dorian"]
subject = "reddit humour {Date.today}"
reddit_username = "..."
reddit_password = "..."
reddit_client_id = "..."
reddit_client_secret = "..."
user_agent = "codedorian.com 1.0"
subreddits = [:frenchmemes, :dinosaure, :MemeFrancais, :rance]
limit = 100
time = :day
limit_per_subreddit = 20
limit_for_subreddits = 100

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

reddit_posts = subreddits.map do |subreddit|
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
  subreddit_images&.map(&:data)&.map do |subreddit_post|
    {
      title: subreddit_post.title,
      url: subreddit_post.url
    }
  end&.first(limit_per_subreddit)
end.compact.flatten.first(limit_for_subreddits)

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
  )
end

subject
```

twitter

```
from = User.find!("dorian")
handles = ["vincent", "dorian"]
subject = "twitter humour {Date.today}"
max_results = 20
twitter_api_key = "..."
twitter_api_key_secret = "..."
open_ai_api_key = "..."

ai_response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-4o",
    messages: [
      { role: :system, content: 'choisis un thème au hasard' },
      { role: :system, content: 'donne moi un mot de recherche humoristique au hasard sur ce thème' },
      { role: :system, content: 'sans guillemets, sans auteurs, juste le mot' },
    ],
  }.to_json,
)

query = Json.parse(ai_response.body).choices.first.message.content

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
    query: "{query} url:photo",
    "tweet.fields": "text",
    "expansions": "attachments.media_keys",
    "media.fields": "media_key,type,url",
    max_results: max_results,
  }
)

search_body = search_response.body
search_json = Json.parse(search_body)

body = search_json.data.map do |tweet|
  '
    <p>
      {tweet.text}
    </p>

    {
      tweet.dig(:attachments, :media_keys)&.map do |media_key|
         search_json.includes.media.detect { |media| media.media_key == media_key }
      end&.compact&.map do |media|
        '
          <p>
            <img alt="{tweet.text}" src="{media.url}" />
          </p>
        '
     end&.join
   }
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
  )
end

subject
```

bal

```
open_ai_api_key = "..."

smtp = Smtp.new(
  address: "smtp.gmail.com",
  port: 587,
  user_name: "dorian@dorianmarie.com",
  password: "...",
  authentication: :plain,
  enable_starttls_auto: true,
)

players = [
  {
    name: "Camilla",
    email: "dorian+camilla@dorianmarie.com",
  },
  {
    name: "Arthur",
    email: "dorian+arthur@dorianmarie.com",
  },
  {
    name: "Romain",
    email: "dorian+romain@dorianmarie.com",
  },
  {
    name: "Leonore",
    email: "dorian+leonore@dorianmarie.com",
  },
  {
    name: "Dorian",
    email: "dorian+dorian@dorianmarie.com",
  },
  {
    name: "Ugo",
    email: "dorian+ugo@dorianmarie.com",
  },
  {
    name: "Margot",
    email: "dorian+margot@dorianmarie.com",
  },
  {
    name: "Xavier",
    email: "dorian+xavier@dorianmarie.com",
  },
  {
    name: "Kate",
    email: "dorian+kate@dorianmarie.com",
  },
  {
    name: "Guillaume",
    email: "dorian+guillaume@dorianmarie.com",
  },
]

groups_sample = [
  "neutres",
  "démocraties de l'OTAN",
  "puissances autoritaires",
]

signs_sample = [
  "se gratte la tête",
  "utilise des abbréviations",
]

names_sample = [
  "France",
  "Êtats-Unis",
  "Japon",
  "Chine",
  "Allemagne",
  "Brésil",
]

groups_response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-4o",
    response_format: {
      type: :json_schema,
      json_schema: {
        name: :groups,
        strict: true,
        schema: {
          type: :object,
          properties: {
            groups: {
              type: :array,
              minItems: 2,
              maxItems: 5,
              items: {
                type: :string,
              },
            },
          },
          required: [:groups],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: :system,
        content: "tableau json de 2 à 5 éléments de groupes pour un jeu",
      },
      {
        role: :system,
        content: "voici un exemple",
      },
      { role: :user, content: groups_sample.to_json(pretty: true) },
    ],
  }.to_json,
)

groups_response_json = Json.parse(groups_response.body)
groups_response_content = groups_response_json.choices.first.message.content
groups = Json.parse(groups_response_content).groups.shuffle

puts(groups.to_json(pretty: true))

signs_response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-4o",
    response_format: {
      type: :json_schema,
      json_schema: {
        name: :signs,
        strict: true,
        schema: {
          type: :object,
          properties: {
            signs: {
              type: :array,
              minItems: players.size * 3,
              maxItems: players.size * 3,
              items: {
                type: :string,
              },
            },
          },
          required: [:signs],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: :system,
        content: "tableau json de {players.size * 3} éléments de signes pour un jeu",
      },
      {
        role: :system,
        content: "voici un exemple",
      },
      { role: :user, content: signs_sample.to_json(pretty: true) },
    ],
  }.to_json,
)

signs_response_json = Json.parse(signs_response.body)
signs_response_content = signs_response_json.choices.first.message.content
signs = Json.parse(signs_response_content).signs.shuffle

puts(signs.to_json(pretty: true))

names_response = Http.post(
  "https://api.openai.com/v1/chat/completions",
  headers: {
    authorization: "Bearer {open_ai_api_key}",
    "content-type": "application/json"
  },
  body: {
    model: "gpt-4o",
    response_format: {
      type: :json_schema,
      json_schema: {
        name: :names,
        strict: true,
        schema: {
          type: :object,
          properties: {
            names: {
              type: :array,
              minItems: players.size,
              maxItems: players.size,
              items: {
                type: :string,
              },
            },
          },
          required: [:names],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: :system,
        content: "tableau json de {players.size} éléments de noms de pays pour un jeu",
      },
      {
        role: :system,
        content: "voici un exemple",
      },
      { role: :user, content: names_sample.to_json(pretty: true) },
    ],
  }.to_json,
)

names_response_json = Json.parse(names_response.body)
names_response_content = names_response_json.choices.first.message.content
names = Json.parse(names_response_content).names.shuffle

puts(names.to_json(pretty: true))

players.each do |player|
  player.group = groups.sample
  player.signs = signs.shift((1..3).sample)
  player.country = names.shift
end

players.each do |player|
  player.clues = (players - [player]).sample((1..3).sample).deep_duplicate
end

puts(players.to_json(pretty: true))

players.each do |player|
  body_html = "
    Salut {player.name}, tu es {player.country}.<br>
    <br>
    Tu appartients aux {player.group}.<br>
    <br>
    Tes signes:<br>
    {player.signs.join("<br>\n")}<br>
    <br>
    Tu connais les signes de ces pays:
    {player.clues.map do |player|
      "{player.country} ({player.group}): {player.signs.join(", ")}"
    end.join("<br>\n")}<br>
    <br>
    Il te suffit de faire tes signes et de reconnaître les signes des autres joueurs.<br>
    <br>
    Le but étant de trouver qui appartient à quel groupe.<br>
    <br>
    Les groupes sont:<br>
    {groups.join("<br>\n")}<br>
    <br>
    Bonne chance.<br>
  "

  smtp.send(
    from: "dorian@dorianmarie.com",
    to: player.email,
    subject: "bal des nations {Date.today}",
    body_html: body_html,
  )
end

nothing
```

hands

```
names = [
  :arthur,
  :baptiste,
  :dorian,
  :fabien,
  :mathieu,
  :michel,
  :vincent,
]

names = names.shuffle

message = "all hands {Date.today}\n\nfirst to be available:\n\n{names.join("\n")}"

slack_app_id = "..."
slack_client_id = "..."
slack_client_secret = "..."
slack_signing_secret = "..."
slack_verification_token = "..."
slack_bot_user_oauth_token = "..."
slack_channel_id = "..." # tech
# slack_channel_id = "..." # product-tech
# slack_channel_id = "..." # dorianlog
slack_team_id = "..."

Http.post(
  "https://slack.com/api/chat.postMessage",
  headers: {
    "content-type": "application/json; charset=utf-8",
    "authorization": "Bearer {slack_bot_user_oauth_token}",
  },
  body: { channel: slack_channel_id, text: message }.to_json
)

Date.today
```

quality

```
names = [
  :arthur,
  :baptiste,
  :dorian,
  :fabien,
  :mathieu,
  :michel,
  :vincent,
]

names = names.shuffle

message = "code quality {Date.today}\n\nfirst to be available:\n\n{names.join("\n")}"

slack_app_id = "..."
slack_client_id = "..."
slack_client_secret = "..."
slack_signing_secret = ".."
slack_verification_token = "..."
slack_bot_user_oauth_token = "..."
slack_channel_id = "..." # tech
# slack_channel_id = "..." # product-tech
# slack_channel_id = "..." # dorianlog
slack_team_id = "..."

Http.post(
  "https://slack.com/api/chat.postMessage",
  headers: {
    "content-type": "application/json; charset=utf-8",
    "authorization": "Bearer {slack_bot_user_oauth_token}",
  },
  body: { channel: slack_channel_id, text: message }.to_json
)

Date.today
```
