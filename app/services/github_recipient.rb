# frozen_string_literal: true

class GithubRecipient
  FORMAT = %r{\A[a-zA-Z0-9][a-zA-Z0-9-]{0,38}/[a-zA-Z0-9_.-]{1,100}\z}

  def self.valid?(recipient)
    recipient.to_s.match?(FORMAT) && !recipient.split("/").last.in?(%w[. ..])
  end
end
