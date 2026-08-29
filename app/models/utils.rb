# frozen_string_literal: true

class Utils
  def self.join(*values)
    values.compact_blank.join(I18n.t("utils.join")).presence
  end
end
