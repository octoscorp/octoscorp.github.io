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

- [ ] Stretch goals / "later me" problems
    - [ ] Allow character editor to load official characters from ID, and "reset" to that character as requested
    - [ ] Edit author, script name
    - [ ] Export: don't include night orders if they are default
    - [ ] Data: include default image URLs
    - [ ] Homebrew: support `jinx` and `special` attributes
        - [ ] Display (jinxes only)
        - [ ] Validation
        - [ ] Input
    - [ ] Loric/Fabled support
    - [ ] Recommended travellers
    - [ ] Utils: Give YAML parser a "loaded" event to allow dependents to wait for it
    - [ ] Script metadata (logo, hideTitle, background, almanac, bootlegger)
        - [ ] Display
        - [ ] Validation (check night order contains dusk/dawn)
        - [ ] Input
    - [ ] Utils: Create tests util

The official script tool at script.bloodontheclocktower.com has (as far as I'm concerned) 1 shortcoming: the night order cannot be modified unless the user has already modified the night order and added it to the script JSON. And while I'm implementing a tool to do that, I might as well combine the tool with the reason I started messing with the night order at all - homebrew characters. Following [the official schema](https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json), we can apply our own validation and make our own version of bloodstar.xyz - but with the purpose of exporting characters as JSON within a script.

### Blog infrastructure

Turn this into a functional blog.

- [ ] Posts page
    - [x] Determine whether this needs to be separate from the home page - home page is now posts.
    - [x] Write site conversion post
    - [ ] Write BotC post
    - [x] Display posts as cards
    - [ ] Default image generation from ID (https://gist.github.com/blixt/f17b47c62508be59987b)
    - [ ] Refine by tags
    - [ ] Store preferences in localStorage
        - [x] ~~Is filtered RSS feed possible?~~ Not server-side, anyone after this can find a way to implement itself
    - [x] ~~Pagination~~ Decided this is unnecessary since the page will load all posts anyway. May become more relevant with more posts, but filtering by tags is the expected workaround
- [x] Post page
    - [x] ~~Display tags~~ These now link back to the posts page, with GET parameters ready to be acted on when tag filtering is implemented
    - [x] Link back to posts page

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
