A page for my own website, using the Jekyll framework and hosted on GitHub pages at [octoscorp.github.io](https://octoscorp.github.io).

## Current Projects

### Improve on React

- [x] Convert to Jekyll
- [x] Configure deployment action
- [x] Remove Jekyll defaults
- [x] Improve default layout (allow wider central column)
- [ ] Cleanup old CSS (styles/defaults.css)
- [x] Configure linting actions

Finishing up the conversion from React to Jekyll. I had some interesting CSS transitions on my old site, and I'm sure that the new site would benefit from either the principles or the transitions themselves.

### Add BotC Script tool

- [x] JSON script import
- [x] Additional character data fetching (scripts have default assumptions)
    - [x] Create API utils
    - [x] Add data to ProjectsMisc repo: Night prio
    - [x] Fetch from repo
- [x] Script result display
    - [x] Night order
    - [x] Playable Characters
    - [x] MVP CSS (i.e. boxes instead of paragraphs)
        - [x] Night order
        - [x] Characters
- [x] Allow click-and-drag reordering of night order
    - [x] Create drag-and-drop utils library
        - [x] Working on CSS classes
        - [x] Should handle visual elements, then hand off to a callback function with the moved element and new index
- [x] Full JSON script exporting
    - [x] Export night order as valid script JSON
- [ ] Custom character creation modal
    - [x] Required fields: ID, Name, Team, Ability
    - [x] Optional fields: edition, flavor, firstNight, firstNightReminder, otherNight, otherNightReminder, reminders, remindersGlobal, setup
    - [x] Import fields into JS
    - [ ] Click-to-edit
    - [ ] Image field and IP track warning (show status code)
    - [ ] "Remove character" button
- [x] "Add character" button
- [ ] Image display from URL (this already works in the night order, shockingly - maybe not necessary?)
- [ ] Other script metadata (author, logo, hideTitle, background, almanac, bootlegger)
- [ ] Stretch goals / "later me" problems
    - [ ] Loric/Fabled support
    - [ ] Recommended travellers
    - [ ] Improve CSS
    - [ ] Export: don't include night orders if they are default
    - [ ] Data: include default image URLs
    - [ ] Night Order: re-add characters if not present in the \_meta lists
    - [ ] Homebrew: support `jinx` and `special` attributes
    - [ ] Allow character editor to load official characters from ID, and "reset" to that character as requested

The official script tool at script.bloodontheclocktower.com has (as far as I'm concerned) 1 shortcoming: the night order cannot be modified unless the user has already modified the night order and added it to the script JSON. And while I'm implementing a tool to do that, I might as well combine the tool with the reason I started messing with the night order at all - homebrew characters. Following [the official schema](https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json), we can apply our own validation and make our own version of bloodstar.xyz - but with the purpose of exporting characters as JSON within a script.

## Planned Projects

### BotC Almanac

The logical next step of the script tool is to maintain an almanac of the non-joke characters put together using it. Unfortunately, this is quite difficult in the context of a GitHub pages site - I cannot host a backend for storing the almanac contents, so without some degree of shenanigans users can only see their own homebrews.

One potential workaround for this is to store data in a GitHub repository. Notes:

- Will need to be a public repository for API fetching
- Limited number of contributing users
    - Personal repositories only have admin, collaborator, and public permission levels
    - Configure rules as best possible to minimise collaborator permissions
        - This has limited efficacy. Best to combine with permissions on PATs - see below
        - At very least, preventing history removal should leave any changes revertible
- Secure access
    - Write actions MUST require authentication
    - Not interested in storing this - anywhere we can place it with JS, we can also retrieve it.
        - Therefore user must re-auth on every write operation (and we should batch them to minimise reauth)
    - User can create a Personal Access Token (PAT), then paste it into the site when submitting.
        - This allows them to limit the token's permissions to mitigate risk. MUST provide instructions on doing so.
    - While only trusted collaborators should be able to add to this repo, mitigate XSS risk in case of token compromise.

Informative links:

- GitHub REST API https://docs.github.com/en/rest/using-the-rest-api/getting-started-with-the-rest-api?apiVersion=2022-11-28&tool=javascript
- Octokit (interaction tool) https://github.com/octokit/authentication-strategies.js/#readme

## Running Locally

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
