Page for my own website, using the Jekyll framework.

## Running

### Setup

Check both ruby and gem are present:
```
ruby -v
gem -v
```

Prevent gem installation as root:
```
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Install essentials:
```
sudo apt-get install ruby-full build-essential zlib1g-dev
gem install jekyll bundler
```

### Testing locally

```
bundle install
bundle exec jekyll serve
```

## Project
- [ ] Improve on React
    - [x] Convert to Jekyll
    - [x] Configure deployment action
    - [x] Remove Jekyll defaults
    - [x] Improve default layout (allow wider central column)
    - [ ] Cleanup old CSS
    - [ ] Configure linting actions
- [ ] Add BotC tool
    - [x] JSON script import
    - [ ] Additional character data fetching (scripts have default assumptions)
        - [x] Create API utils
        - [ ] Add data to ProjectsMisc repo: Night prio, image URLs
        - [ ] Fetch from repo
    - [ ] Script result display
        - [x] Night order
        - [x] Playable Characters
        - [ ] MVP CSS (i.e. boxes instead of paragraphs)
            - [x] Night order
            - [ ] Characters
    - [x] Allow click-and-drag reordering of night order
      - [x] Create drag-and-drop utils library
        - [x] Working on CSS classes
        - [x] Should handle visual elements, then hand off to a callback function with the moved element and new index
    - [x] Full JSON script exporting
        - [x] Export night order as valid script JSON
    - [ ] Custom character creation modal
        - [ ] Required fields: ID, Name, Team, Ability
        - [ ] Optional fields:
            - [ ] Images (locking down is unnecessary, if they load dumb JSON it's their own fault)
            - [ ] Other (edition, flavor, firstNight, firstNightReminder, otherNight, otherNightReminder, reminders, remindersGlobal, setup, jinxes, special)
        - [ ] Other script metadata (author, logo, hideTitle, background, almanac, bootlegger)
- [ ] BotC improvements
    - [ ] Loric/Fabled
    - [ ] Recommended travellers
    - [ ] Improve CSS
    - [ ] Export: don't include night orders if they are default
