# frozen_string_literal: true

require "test_helper"

class CodeImageTest < ActiveSupport::TestCase
  test "proxy URLs and relative page candidates preserve source URLs" do
    url =
      Code.evaluate(
        'Image.proxy_url("https://example.com/image.png?x=1", disposition: :attachment)'
      ).to_s
    assert url.start_with?("https://proxy.dorianmarie.com/image.png?")
    assert_equal "https://example.com/image.png?x=1",
                 Rack::Utils.parse_query(URI(url).query)["url"]
    html =
      '<base href="/articles/"><meta property="og:image" content="../hero.png"><img src="small.png" width="20"><main><img src="large.png"></main>'
    assert_equal %w[
                   https://example.com/hero.png
                   https://example.com/articles/large.png
                 ],
                 CodeImage.page_candidates(html, "https://example.com/post")
    assert_raises(Code::Error) { CodeImage.proxy_url("javascript:alert(1)") }
  end

  test "image selection decodes content and excludes already seen hashes" do
    image =
      Vips::Image
        .black(100, 100)
        .new_from_image([200, 100, 50])
        .write_to_buffer(".png")
    source = "https://example.com/image.png"
    request =
      stub_request(:get, CodeImage.proxy_url(source)).to_return(
        body: image,
        headers: {
          "Content-Type" => "image/png",
          "Content-Length" => image.bytesize.to_s
        }
      )
    selected = CodeImage.select([source])
    assert_equal Digest::SHA256.hexdigest(image), selected[:sha256]
    assert_equal 100, selected[:width]
    assert_nil CodeImage.select([source], excluded_hashes: [selected[:sha256]])
    assert_requested request, times: 2
  end

  test "a fake or truncated image is skipped for a valid fallback" do
    first = "https://example.com/broken.png"
    second = "https://example.com/good.png"
    image = Vips::Image.black(100, 100).write_to_buffer(".png")
    stub_request(:get, CodeImage.proxy_url(first)).to_return(
      body: "not an image" * 20,
      headers: {
        "Content-Type" => "image/png"
      }
    )
    stub_request(:get, CodeImage.proxy_url(second)).to_return(
      body: image,
      headers: {
        "Content-Type" => "image/png"
      }
    )
    assert_equal second, CodeImage.select([first, second])[:original_url]
  end
end
