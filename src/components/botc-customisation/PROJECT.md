# BotC Customisation tools

The official script tool is great, but lacks a little ability in regard to nighttime ordering. Likewise, bloodstar is a pain to use for creating homebrew characters.

These tools are intended to serve as a stopgap to allow configuration of the fields which otherwise require more work.

Heavily intended to use the schema from https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json .

## Progress

- [ ] JSON script import
- [ ] Additional character data fetching (scripts have default assumptions)
- [ ] Script result display
  - [ ] Night order
  - [ ] Characters
- [ ] Allow click-and-drag reordering of night order
- [ ] Export night order as valid script JSON
- [ ] Custom character creation modal
  - [ ] Required fields: ID, Name, Team, Ability
  - [ ] Optional fields:
    - [ ] Images (lock down to prevent CSRF - maybe only imgur support?)
    - [ ] Other (edition, flavor, firstNight, firstNightReminder, otherNight, otherNightReminder, reminders, remindersGlobal, setup, jinxes, special)
- [ ] Other script metadata (author, logo, hideTitle, background, almanac, bootlegger)
