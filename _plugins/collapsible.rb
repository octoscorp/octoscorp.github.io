module Jekyll
  # Custom collapsible tag. Based heavily on the inbuilt highlight tag
  class CollapsibleTagBlock < Liquid::Block

    # The regular expression syntax checker. Start with the summary (either quoted
    # or single-word). Follow that by zero or more space separated options that
    # take the form: name="value" or name="<value list>"
    #
    # <value list> is a space-separated list of words (including "-" as valid)
    SYNTAX = %r!^(\w+|"\w+(?:\s\w+)*")(?:\s(\w+(?:="([A-Za-z0-9_\s-]*)")))*$!.freeze

    def initialize(tag_name, text, tokens)
      super
      if text.strip =~ SYNTAX
        @summary = Regexp.last_match(1)
        @collapsible_options = parse_options(Regexp.last_match(2))
      else
        raise SyntaxError, <<~MSG
          Syntax Error in tag 'collapsible' while parsing the following:

          #{text}

          Valid syntax: collapsible "<summary>" [option="<values>"]
          
          Where <values> is a space-separated word list
        MSG
      end
    end

    def render(context)
      content = super.to_s
      open_tag = "<details class='#{@collapsible_options[:class]}'>"
      "#{open_tag}<summary>#{@summary}</summary>#{content}</details>"
    end

    OPTIONS_REGEX = %r!(?:\w="[^"]*"|\w=\w|\w)+!.freeze

    def parse_options(input)
      options = {}
      return options if input.empty?

      input.scan(OPTIONS_REGEX) do |opt|
        key, val = opt.split("=")
        # Convert to array
        val.delete!('"')
        val = val.split
        options[key.to_sym] = value
      end

      options
    end
  end
end

Liquid::Template.register_tag('collapsible', Jekyll::CollapsibleTagBlock)