# A practical guide to Code

Code is the programming language used by codedorian.com programs, steps, links, and other programmable inputs. Its implementation is the `code-ruby` gem. This guide targets version 6.0.0.

Code has Ruby-like expressions and collection methods, together with functions written using `=>`. The examples below use Code syntax; the final section shows how to run Code from Ruby.

## Your first program

```code
name = "Ada"

puts("Hello, {name}")

name
```

Assign values with `=`. Use newlines to separate statements. `puts(...)` writes to the program output, and the last expression is the program's result. Here the output is `Hello, Ada` and the result is `"Ada"`.

Double-quoted strings interpolate expressions inside `{...}`. For example, `"Tomorrow: {Date.today + 1}"` inserts the expression's value.

## Values and names

```code
name = "Ada"
count = 3
price = 12.5
enabled? = true
missing = nothing
provider = :slack
names = ["Ada", "Grace"]
settings = { enabled?: true, limit: 10 }
```

`nothing` represents an absent value. Symbols such as `:slack` are useful for statuses, keys, and other named values. Lists use `[...]`, and dictionaries use `{ key: value }`.

Use descriptive lowercase names for variables and uppercase names for configuration constants:

```code
HTTP_TIMEOUT = 45

HTTP_OPTIONS = {
  timeout: HTTP_TIMEOUT,
  retry_delays: [1, 2, 4]
}
```

Evaluation proceeds in order. Define each dependency before using it, including inside dictionaries. Defining `HTTP_TIMEOUT` after `HTTP_OPTIONS` produces an undefined-name error.

## Calling methods and functions

Use a dot to call a method on a value:

```code
name = "  Ada  "

name.strip
name.strip.upcase
name.present?
```

Omit parentheses for receiver methods without arguments, such as `response.success?` or `Date.today`. Include parentheses when passing arguments, such as `text.truncate(100)`.

Define a function by assigning an arrow expression:

```code
greet = (name) => {
  "Hello, {name}"
}

greet("Ada")
```

The last expression in the function is its result. Use `return(...)` to exit early:

```code
greet = (name) => {
  if name.blank?
    return("Hello")
  end

  "Hello, {name}"
}
```

Functions can have default and named parameters:

```code
add = (number, amount = 1) => {
  number + amount
}

label = (name:) => {
  "Name: {name}"
}

add(3)
label(name: "Ada")
```

A bare function call needs parentheses even when it has no arguments: `run()`. To define it, write `run = () => { ... }`.

## Conditions and predicates

```code
count = 3

if count > 0
  "Items available"
else
  "No items"
end
```

An `if` expression returns the selected branch's value, so it can be assigned:

```code
count = 3

message = if count > 0
  "Items available"
else
  "No items"
end
```

Use `and`, `or`, and `not` for logical operations. Add parentheses when combining conditions to make the grouping explicit:

```code
code = 201

(code.in?(200...300) or code.in?(400...500)) and code != 408
```

`200...300` excludes 300; `200..300` includes it.

Prefer predicates that express the condition directly:

```code
question = "What is Code?"
answer = "A programming language"

question.present? and answer.present?
```

`present?` checks for a meaningful value, while `blank?` checks the opposite. Use `nothing?` specifically to check for absence. For lists, `none?` expresses that no elements match a predicate.

## Optional values and dictionaries

```code
profile = nothing

profile&.name
```

Safe navigation with `&.` returns `nothing` when the receiver is absent.

Dictionaries support named access, explicit lookup, and nested lookup:

```code
body = {
  name: "Ada",
  success?: true,
  response_format: {
    json_schema: { type: "object" }
  }
}

body.name
body.success?
body.get(:name)
body.dig(:response_format, :json_schema)
```

Use `get` when a key is optional: a missing key returns `nothing`. Use `fetch` when the key is required and its absence should raise an error.

```code
body = {}

schema_options = body.dig(:response_format, :json_schema) or {}
```

Use `presence` to turn a blank value into `nothing` before applying a fallback:

```code
name = ""

display_name = name.presence or "Anonymous"
```

## Working with lists

Collection methods let you transform or inspect values:

```code
numbers = [1, 2, 3]

doubled = numbers.map((number) => {
  number * 2
})

large = numbers.select((number) => {
  number > 1
})
```

Use `&:method` when the function simply calls one method on each element:

```code
parts = ["Hello", "", nothing, "world"]

text = parts.select(&:present?).join("\n\n")
```

This keeps the present values and joins them with a blank line. The shorthand also works with predicates such as `any?`, `all?`, and `none?`:

```code
numbers = [1, 2, 3]

numbers.any?(&:positive?)
numbers.all?(&:positive?)
numbers.none?(&:negative?)
```

Use `each` for actions and `map` when you need a transformed list:

```code
["Ada", "Grace"].each((name) => {
  puts("Hello, {name}")
})
```

## Strings and JSON

Use built-in string methods for common transformations:

```code
text = "  Hello, world  "

text.strip
text.strip.downcase
text.strip.truncate(10, omission: "…")
```

Parse JSON to work with its values, and serialize only when you need a JSON string:

```code
json = Json.parse("[1, 2, 3]")

json.first
json.to_json
```

## HTTP requests

`Http.fetch` accepts a method, URL, and options. Use `json:` to encode a JSON request body and set its content type:

```code
response = Http.fetch(
  :post,
  "https://example.com/api/messages",
  json: { text: "Hello" }
)

if response.success?
  response.json!
else
  fail("Request failed: {response.status}")
end
```

This example makes a real request when executed; replace the URL with your API endpoint.

`response.code` is the numeric HTTP code, while `response.status` is its symbolic name. For example, compare `response.status` with `:forbidden`, `:too_many_requests`, or `:request_timeout`.

`response.json!` parses the response body and raises if it is invalid JSON. Use `response.body` when you need the raw text. A successful response can still have an empty or non-JSON body, so parse JSON only when the endpoint promises it.

The defaults are a 10-second connection timeout, 30-second read and write timeouts, zero redirects, and zero retries. Supply overrides only when needed. Define shared options once, with their dependencies first:

```code
HTTP_TIMEOUT = 45

HTTP_OPTIONS = {
  timeout: HTTP_TIMEOUT,
  retry_delays: [1, 2, 4]
}

response = Http.fetch(:get, "https://example.com/feed", HTTP_OPTIONS)

response.body
```

Retries can repeat a remote action. Configure them according to the endpoint's behavior and use idempotency keys where supported.

## Using Code on codedorian.com

The application supplies additional objects, including `Current`, `Datum`, `User`, `Delivery`, and `Ai`. These depend on the execution context and are separate from the standalone language runtime.

Start inputs by setting their intended time zone and output locale:

```code
Current.time_zone = "Europe/Paris"

Current.locale = :en
```

Place configuration constants next, followed by important execution values, then the program's actions. Keep constants in dependency order.

`Current` gives access to the active execution context. For example, programs can inspect `Current.program`, steps can inspect `Current.step` and `Current.subscription`, and delivery inputs can inspect `Current.delivery`. Check that optional context exists before relying on it.

Use `Datum` for stored per-user values:

```code
settings = Datum.value!(:settings)

settings
```

`Datum.value(:settings)` returns `nothing` when the datum is missing. `Datum.value!(:settings)` requires it to exist.

For AI generation, write the prompt in English and set `Current.locale` for the intended output language. The application passes the current context to generation:

```code
Current.time_zone = "Europe/Paris"

Current.locale = :fr

Ai.generate(
  messages: [
    {
      role: :user,
      content: "Write a short welcome message in the current locale."
    }
  ]
)
```

Generation uses the application's configured model by default. Return the generated value directly when it is the input's desired result.

Delivery inputs should use the delivery object's built-in helpers:

```code
Current.time_zone = "Europe/Paris"

Current.locale = :en

BODY_LIMIT = 4_000

delivery = Current.delivery

public? = delivery.public?
idempotency_key = delivery.idempotency_key
content = delivery.compact_text(BODY_LIMIT)

content
```

When reporting an adapter outcome, use the appropriate result, such as `Delivery.accepted(provider_id)`, `Delivery.uncertain`, or `Delivery.rejected(:rate_limited, retryable?: true)`. Use `delivery.private?` when checking for private visibility.

## Errors and debugging

Use `puts(...)` to record progress and `fail(...)` to stop with an explanatory error:

```code
settings = {}

if settings.blank?
  fail("Settings are missing")
end
```

An expression can recover from an error with `rescue`:

```code
Json.parse!("invalid JSON") rescue nothing
```

Use recovery only when that failure is expected. For optional dictionary keys, prefer `get` rather than rescuing an error from `fetch`.

When a name is reported as undefined, check its spelling, whether it was defined earlier, and whether it is available in the current function or execution context. Assign a function with `name = (...) => { ... }`; call it with `name(...)`.

## Running Code from Ruby

With the `code-ruby` gem installed:

```ruby
require "code-ruby"

result = Code.evaluate("[1, 2, 3].map((number) => { number * 2 })")

result.raw # => [2, 4, 6]
```

`Code.parse(source)` checks syntax and returns the parse tree. `Code.format(source)` formats source code. Parsing does not check that every name will exist at runtime; evaluate representative examples as well.

For more examples, read the language's [runtime documentation definitions](../../code-ruby/lib/code/object/) and [language specifications](../../code-ruby/spec/code_spec.rb). The application's [Code object adapters](../app/models/code/object/) describe the additional APIs available on codedorian.com.
