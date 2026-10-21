# frozen_string_literal: true

class CodeImage
  SCHEMES = %w[http https].freeze
  MAX_BYTES = 5.megabytes
  MIN_BYTES = 100
  MAX_CANDIDATES = 12
  MIN_DIMENSION = 80
  MAX_PIXELS = 16_000_000
  INLINE_DISPOSITION = "inline"
  ATTACHMENT_DISPOSITION = "attachment"
  DEFAULT_DISPOSITION = INLINE_DISPOSITION
  DEFAULT_WIDTH = 560
  WIDTH_RANGE = (1..2000).freeze
  DISPOSITIONS = [INLINE_DISPOSITION, ATTACHMENT_DISPOSITION].freeze
  EXTENSIONS = %w[jpg jpeg png gif webp avif].freeze
  CONTENT_TYPES = %w[
    image/png
    image/jpeg
    image/gif
    image/webp
    image/avif
  ].freeze
  DEFAULT_EXTENSION = "jpg"
  PROXY_BASE_URL = "https://proxy.dorianmarie.com"
  PROXY_FIT = "scale-down"
  HTTP_OK = 200
  HTTP_OPTIONS = {
    open_timeout: 5,
    read_timeout: 20,
    max_retries: 0,
    max_bytes: MAX_BYTES
  }.freeze
  DECODE_OPTIONS = { access: :sequential, fail_on: :warning }.freeze
  BASE_SELECTOR = "base[href]"
  METADATA_SELECTOR =
    "meta[property='og:image:secure_url'], meta[property='og:image'], meta[name='twitter:image'], meta[property='twitter:image']"
  CONTENT_IMAGE_SELECTOR = "article img, main img"
  IMAGE_SELECTOR = "img"

  def self.proxy_url(
    url,
    disposition: DEFAULT_DISPOSITION,
    width: DEFAULT_WIDTH
  )
    uri = URI.parse(url)
    unless SCHEMES.include?(uri.scheme) && uri.host.present? &&
             uri.userinfo.nil?
      raise Code::Error, "invalid image URL"
    end
    unless DISPOSITIONS.include?(disposition) && WIDTH_RANGE.cover?(width)
      raise Code::Error, "invalid image options"
    end

    extension = File.extname(uri.path).delete_prefix(".").downcase
    extension = DEFAULT_EXTENSION unless EXTENSIONS.include?(extension)
    "#{PROXY_BASE_URL}/image.#{extension}?" +
      {
        url: url,
        disposition: disposition,
        width: width,
        fit: PROXY_FIT
      }.to_query
  rescue URI::InvalidURIError
    raise Code::Error, "invalid image URL"
  end

  def self.select(candidates, excluded_hashes: [])
    candidates
      .filter_map { |value| value.to_s.strip.presence }
      .uniq
      .first(MAX_CANDIDATES)
      .each do |source|
        url = proxy_url(source)
        response = Code::Object::Http.code_get(url, HTTP_OPTIONS).as_json
        next unless response.fetch("code") == HTTP_OK

        content_type =
          response.fetch("headers")["content-type"]
            .to_s
            .split(";")
            .first
            .to_s
            .strip
            .downcase
        next unless CONTENT_TYPES.include?(content_type)

        body = response.fetch("body")
        next unless body.bytesize.between?(MIN_BYTES, MAX_BYTES)

        length = response.fetch("headers")["content-length"]
        next if length && length.to_i != body.bytesize

        image = Vips::Image.new_from_buffer(body, "", **DECODE_OPTIONS)
        unless image.width >= MIN_DIMENSION && image.height >= MIN_DIMENSION &&
                 image.width * image.height <= MAX_PIXELS
          next
        end

        image.avg
        hash = Digest::SHA256.hexdigest(body)
        next if excluded_hashes.include?(hash)

        return(
          {
            original_url: source,
            inline_url: url,
            attachment_url:
              proxy_url(source, disposition: ATTACHMENT_DISPOSITION),
            sha256: hash,
            width: image.width,
            height: image.height
          }
        )
      rescue Code::Error, Vips::Error
        next
      end
    nil
  end

  def self.page_candidates(html, url)
    page = Nokogiri.HTML(html)
    base = page.at_css(BASE_SELECTOR)&.[]("href")
    url = URI.join(url, base).to_s if base.present?
    metadata = page.css(METADATA_SELECTOR).pluck("content")
    nodes = page.css(CONTENT_IMAGE_SELECTOR)
    nodes = page.css(IMAGE_SELECTOR) if nodes.empty?
    images =
      nodes
        .reject do |node|
          (
            node["width"].to_i.positive? && node["width"].to_i < MIN_DIMENSION
          ) ||
            (
              node["height"].to_i.positive? &&
                node["height"].to_i < MIN_DIMENSION
            )
        end
        .flat_map { |node| [node["data-src"], node["src"]] }
    (metadata + images)
      .filter_map do |candidate|
        next if candidate.blank?

        resolved = URI.join(url, candidate).to_s
        resolved if SCHEMES.include?(URI.parse(resolved).scheme)
      rescue URI::InvalidURIError, URI::BadURIError
        nil
      end
      .uniq
      .first(MAX_CANDIDATES)
  rescue URI::InvalidURIError, URI::BadURIError
    []
  end
end
