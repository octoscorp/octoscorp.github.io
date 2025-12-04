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
    - [ ] Remove Jekyll defaults
    - [ ] Cleanup old CSS
    - [ ] Configure linting actions
- [ ] Add BotC tool
    - [x] JSON script import
    - [ ] Additional character data fetching (scripts have default assumptions)
    - [ ] Script result display
        - [ ] Night order
        - [x] Playable Characters
        - [ ] Loric/Fabled
        - [ ] Recommended travellers
    - [ ] Allow click-and-drag reordering of night order
    - [ ] Export night order as valid script JSON
    - [ ] Custom character creation modal
        - [ ] Required fields: ID, Name, Team, Ability
        - [ ] Optional fields:
            - [ ] Images (lock down to prevent CSRF - maybe only imgur support?)
            - [ ] Other (edition, flavor, firstNight, firstNightReminder, otherNight, otherNightReminder, reminders, remindersGlobal, setup, jinxes, special)
        - [ ] Other script metadata (author, logo, hideTitle, background, almanac, bootlegger)