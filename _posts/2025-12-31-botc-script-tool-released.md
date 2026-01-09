---
layout: post
title: Blood on the Clocktower Homebrew Tool - Release
date: 2025-12-31 12:16:00 +1300
tags: website demo botc
---

Celebrating the initial release of the BotC homebrew tool with a how-to guide.

The tool itself can be found at [[1]][homebrew-tool].

# What is Blood on the Clocktower?

Blood on the Clocktower (BotC) [[2]][botc] is a social deduction game. That's the category that includes games such as Werewolf, Mafia, and Among Us.

In social deduction games, players are divided into "good" and "evil" teams. Typically there are more players on the good team, but the evil team gets to know who the other members of their team are. Then, the game cycles through phases - an action phase where players affect the game state, and a voting phase where all players choose who they want to vote out of the game. The good team wins if they can vote out enough of the evil team (typically one specific player); the evil team wins if they can kill off enough of the good team (typically all but one player).

BotC differs from other games in this category in that all players have a unique character and ability. There's no "I am the villager, I do nothing" here! For example, the Soldier ability reads [[3][botc-wiki]-[4][botc-tracker]]:

> You are safe from the Demon.

![Character token for the Soldier](https://botc-tracker.com/pngs/soldier.webp"){: width="250"}

## Scripts

Because each player in a game must (generally) have a different character, a game is run with a list of characters (a "script") that might be in play. The beginner script, Trouble Brewing, is shown below [[3][botc-wiki],[5][boardgamegeek]]:

![Trouble Brewing Script](<https://cf.geekdo-images.com/7gua6glAEhVwX1iXec6j0Q__original/img/hlsRJLcdmeGhf_5J8NfJzIuDZXk=/0x0/filters:format(jpeg)/pic5478037.jpg>)

There are over 100 official characters published by The Pandemonium Institute, and some napkin math on my part concluded that this leads to around `2.3e25` possible scripts combining them. Thankfully, they provide a facility for the community to combine these in their own ways with the official script tool [[6]][botc-script-tool]. Below is just one example, but more can be found online at [[7]][botc-scripts].

![Custom script - "Spooky Scary Outsiders"](https://i.imgur.com/zLCGJWD.png)

The tool can output the script in PDF, PNG, or JSON format. While the other formats are more useful for in-person play, the JSON format can be loaded by the official [[8]][botc-app] or unofficial [[9]][botc-app-unofficial] apps for online play. It can also be loaded by the script tool itself, e.g. for slightly modifying an existing script.

### Homebrewing

In addition to the official characters, the schema for the JSON format [[10]][botc-json-schema] specifies a format for adding homebrew characters such as the "Grave Robber" below.

```
...
  {
    "id": "graverobber",
    "name": "Grave Robber",
    "image": [
      "https://i.imgur.com/EKIL9Pl.png"
    ],
    "team": "townsfolk",
    "ability": "Each night*, you learn a dead character (or that all players are alive).",
    "firstNight": 0,
    "otherNight": 68,
    "otherNightReminder": "If no dead characters are in play, shake your head. Otherwise, show the character of the player marked {ROBBED}. ",
    "reminders": "Robbed"
  },
...
```

![Custom character - "Grave Robber" icon](https://i.imgur.com/EKIL9Pl.png){: width="250"}

However, this requires editing the JSON to match the schema - not the easiest, nor a particularly error-safe way to accomplish it. So, the natural next tool we need is one that can edit the JSON for us and constrain our choices to valid ones.

It's worth mentioning Bloodstar [[11]][bloodstar] here, as this does provide homebrew capabilities but as far as I am aware does not allow exporting JSON.

# The tool. The tool for homebrew, the tool chosen especially to homebrew characters, the homebrew tool. That tool?

Now all of that's out of the way, we can finally get into what the tool at [[1]][homebrew-tool] is and what it does. Very simply, it allows a user to create/edit a script with homebrew characters, and provides a constrained editor for creating these characters.

It all operates in client-side JavaScript (with the exception of fetching data on the official characters), so do make sure to save when you're finished. This is the reason the conversion of this site in [[12]][react-conversion] was necessary - I needed more control over the JavaScript.

## How to use

### Characters

Arriving at the demo, you have the choice of beginning a script from scratch or importing one as JSON. Once you've chosen, you can add new characters with the **Add (custom) character** button near the top of the page:

![Character addition button](https://i.imgur.com/gRnEzYb.png){: style="display:inline"} ![Character creation/edit modal](https://i.imgur.com/UIn4AFD.png)

You'll see a complicated modal in front of you. Thankfully, only the top 4 fields are required: Name, ID, Team, and Ability. The **auto** checkmark for ID determines whether to generate the ID automatically from the name - you can uncheck this if you need to edit the ID, but it's usually unnecessary.

Once you've filled in your character data, click the **Save** button at the bottom to continue:

![Modal save button](https://i.imgur.com/2gSPCTZ.png)

With a character on the page, you can click them to bring up the same modal - this time, to edit that character. This is also the way to delete them from the script, using the **Delete Character** button.

### Night Order

Below the character display is a section titled **First Night**. This is, unsurprisingly, the night order for the first night of the game. Characters show in here if they have a reminder for this night, and (by default) are displayed in the order of their priority for this night.

For instance, the Investigator has a first night priority of 45, compared to the Empath which has a priority of 47. This means the Investigator will go before the Empath:

![Image showing Investigator acting before the Empath](https://i.imgur.com/MGuFZde.png)

However, the night order is also customisable. Entries in this list can be re-ordered as desired (though this ordering is usually in place for a reason, and shouldn't be completely ignored). To do this, drag-and-drop the night reminders onto each other - the dropped reminder will go just before whichever reminder you drop it onto.

![Image showing Empath now acting before the Investigator](https://i.imgur.com/81YgZan.png)

### Save your work

I will reiterate that client-side JavaScript is not good at remembering what you did. Save it or lose it! To save your work, you can click the **Export as JSON** button at the top of the page. This will download the script file for you, ready to be loaded into whatever you require. If you want the PDF or PNG versions, you can import the JSON into the official tool [[6]][botc-script-tool] and export it as one of those formats.

### Limitations

Currently, there's no support for Fabled, Loric, or Traveller characters. There's also no support for Jinxes or the `special` attributes for app integration. Additionally, the image field should support multiple URLs but does not.

## Troubleshooting

Some common wrinkles that are still being ironed out:

- How do I clear the script?
    - For the moment, hard-refreshing the page (Ctrl-Shift-R or press-and-hold the refresh button) is the main way to do this. You could also go through and delete all the characters manually.
- `Did not recognise <character> as an official character ID`, but it definitely is?
    - There's a funky timing bug going on. Refresh and try again (a few attempts might be needed). (TODO: is refresh necessary)?

Got a problem that's not on this list? Report it on GitHub [[13]][report-bug] and I'll see what I can do.

# References

[1] - [BotC homebrew tool][homebrew-tool]

[2] - [Blood on the Clocktower official site][botc]

[3] - [BotC official wiki][botc-wiki]

[4] - [BotC Tracker (image source)][botc-tracker]

[5] - [BoardGameGeek (image source)][boardgamegeek]

[6] - [BotC official script tool][botc-script-tool]

[7] - [BotC scripts site][botc-scripts]

[8] - [BotC official app (requires a paying user)][botc-app]

[9] - [BotC unofficial app][botc-app-unofficial]

[10] - [BotC script JSON schema][botc-json-schema]

[11] - [Bloodstar.xyz - homebrew character editor][bloodstar]

[12] - [Blog post on this site's conversion to Jekyll from React][react-conversion]

[13] - [Report an issue on this site][report-bug]

[botc]: https://bloodontheclocktower.com/
[botc-wiki]: https://wiki.bloodontheclocktower.com
[botc-tracker]: https://botc-tracker.com
[boardgamegeek]: https://boardgamegeek.com/thread/2885631/botc-game-95-over-mechanical-trouble-brewing-no-ri
[botc-script-tool]: https://script.bloodontheclocktower.com/
[botc-app]: https://botc.app/
[botc-app-unofficial]: https://clocktower.live/
[botc-scripts]: https://www.botcscripts.com/
[botc-json-schema]: https://github.com/ThePandemoniumInstitute/botc-release/blob/main/script-schema.json
[bloodstar]: https://bloodstar.xyz/
[report-bug]: https://github.com/octoscorp/octoscorp.github.io/issues/new?template=bug_report.md

[react-conversion]: {% post_url 2025-12-23-conversion-from-react %}

[homebrew-tool]: {% link botc/script-customiser.html %}
