import React from 'react';
import './GridTable.css';

function ProjectsPersonal() {
    return (
        <div className="project-table">
            <div className="row-start heading grid-item">Name</div>
            <div className="heading grid-item">Platform<br /><span className='bright-darker-text-color font--tiny'>Click for source code</span></div>
            <div className="heading grid-item">Description</div>

            <div className="row-start grid-item">Personal Website</div>
            <div className="grid-item"><a href='https://github.com/octoscorp/octoscorp.github.io' target='_blank'>React</a></div>
            <div className="grid-item">A website to serve as a portfolio of projects. Designed with responsiveness in mind.</div>

            <div className="row-start grid-item">Diplomacy Tool</div>
            <div className="grid-item"><a href='https://github.com/octoscorp/DiplomacyTool' target='_blank'>Python</a></div>
            <div className="grid-item">An application to automate adjudicating sets of orders for the board game Diplomacy. The most recent work completed on it involved a framework for applying the Diplomacy Adjudicator Test Cases to ensure compliance.</div>

            <div className="row-start grid-item">Third Law</div>
            <div className="grid-item"><a href='undefined' disabled target='_blank'>GDScript</a></div>
            <div className="grid-item">A larger game which I am working on, revolving around the concept of Newton's third law of motion (regarding equal and opposite reactions). This grew from a friend noticing that many games and engines ignore this. <span className='secondary-text-color'>A demo should be forthcoming soon!</span></div>

            <div className="row-start grid-item">Summoner's Apprentice</div>
            <div className="grid-item"><a href='https://github.com/octoscorp/LD55' target='_blank'>GDScript</a></div>
            <div className="grid-item">My submission to the Ludum Dare 55 Game Jam. This was the first game I created in an engine, and was made in 48 hours. The <a href='https://antisage.itch.io/summoners-apprentice' target='_blank'>itch page</a> for this will eventually have a version compiled for web.</div>
        </div>
    )
}

export default ProjectsPersonal