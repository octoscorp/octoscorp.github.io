import React from 'react'
import { Link } from 'react-router-dom'

function Games() {
    return (
        <div className="centre-container">
            <h2 className="logo-font font--extra-large">Games <hr /></h2>
            <p>I've been making use of my time while unemployed to learn how to make games, and doing plenty of socialising.</p>
            <br />
            <h3 className="font--medium ">Board Games</h3>
            <p>I enjoy TTRPGs, and have been running a bi-weekly game of Dungeons and Dragons since the end of 2020. Additionally, I have recently become interested in Diplomacy, and am currently working on a tool to help adjudicate this.</p>
            <p>Further, I have experimented with Monopoly and plan to experiment with Settlers of Catan to gain a better sense of game balancing.</p>
            <br />
            <h3 className="font--medium ">Video Games</h3>
            <p>My primary development experience is with Godot 4, although for one game jam my team made use of Unreal Engine 5.</p>
            <p>If you'd like to see the results, visit <Link to='https://antisage.itch.io/'>my page on itch.io</Link> which lists all the video games I've worked on so far.</p>
            <p>If instead you'd like to see the code, project files and other awkward parts, visit <Link to='https://github.com/octoscorp'>my GitHub</Link>.</p>
        </div>
    )
}

export default Games
