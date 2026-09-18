# frozen_string_literal: true

require "test_helper"
require "socket"

class HttpTest < ActiveSupport::TestCase
  test "returns error responses and preserves the request and response headers" do
    with_server("HTTP/1.1 429 Too Many Requests\r\nContent-Length: 4\r\nRetry-After: 60\r\nConnection: close\r\n\r\nslow") do |uri, received|
      uri.query = URI.encode_www_form(query: "hello world")
      request = Net::HTTP::Get.new(uri, "Authorization" => "Bearer token")

      response = Http.request(request, proxy: nil)

      assert_equal "429", response.code
      assert_equal "slow", response.body
      assert_equal "60", response["Retry-After"]
      headers, = received.pop
      assert_includes headers, "GET /?query=hello+world HTTP/1.1\r\n"
      assert_includes headers, "Authorization: Bearer token\r\n"
    end
  end

  test "sends form data and basic authentication with a pinned address" do
    with_server do |uri, received|
      uri.host = "localhost"
      request = Net::HTTP::Post.new(uri)
      request.basic_auth("client", "secret")
      request.set_form_data(message: "hello & goodbye")

      response = Http.request(request, ipaddr: "127.0.0.1", proxy: nil, max_retries: 0)

      assert_equal "200", response.code
      headers, body = received.pop
      assert_includes headers, "Host: localhost:#{uri.port}\r\n"
      assert_includes headers, "Authorization: Basic #{Base64.strict_encode64('client:secret')}\r\n"
      assert_includes headers, "Content-Type: application/x-www-form-urlencoded\r\n"
      assert_equal "message=hello+%26+goodbye", body
    end
  end

  test "propagates read timeouts without retrying when retries are disabled" do
    with_server(nil) do |uri, received, server|
      assert_raises(Net::ReadTimeout) do
        Http.request(Net::HTTP::Get.new(uri), read_timeout: 0.05, max_retries: 0, proxy: nil)
      end
      assert_equal 1, received.size
      assert_nil server.wait_readable(0)
    end
  end

  private

  def with_server(response = "HTTP/1.1 200 OK\r\nContent-Length: 2\r\nConnection: close\r\n\r\nok")
    server = TCPServer.new("127.0.0.1", 0)
    received = Queue.new
    release = Queue.new
    thread = Thread.new do
      socket = server.accept
      headers = +""
      while (line = socket.gets)
        headers << line
        break if line == "\r\n"
      end
      length = headers[/Content-Length: (\d+)/i, 1].to_i
      received << [headers, length.positive? ? socket.read(length) : ""]
      response ? socket.write(response) : release.pop
    ensure
      socket&.close
    end
    yield URI("http://127.0.0.1:#{server.addr[1]}/"), received, server
  ensure
    release << true
    server&.close
    thread&.kill
    thread&.join
  end
end
