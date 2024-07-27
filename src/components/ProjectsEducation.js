import React from 'react';
import './GridTable.css';

function ProjectsEducation() {
    return (
        <div className="project-table">
            <div className="row-start heading grid-item">Project</div>
            <div className="heading grid-item">Platform</div>
            <div className="heading grid-item">Description</div>

            <div className="row-start grid-item">CodeWOF Extension</div>
            <div className="grid-item">
                Python (Django framework)<br />
                JavaScript
            </div>
            <div className="grid-item">
                <p>This was my final year project, for which I was working solo with supervision. I extended the existing CodeWOF website with a page for adding questions to the database. This covered the full technology stack, from designing and implementing the frontend page down to changing some aspects of the database structure.</p>
                <p>This served well as a learning experience, but isn't my proudest work. I was too ambitious in what I hoped to complete, and found myself struggling to commit the time which the sizable technology stack and limited documentation required. It serves as a good example for me of the importance of code maintainability.</p>
            </div>

            <div className="row-start grid-item">LensFolio</div>
            <div className="grid-item">
                Java (Spring Framework)<br />
                Thymeleaf (an HTML templating framework)<br />
                JavaScript
            </div>
            <div className="grid-item">
                <p>This was my third-year project, as part of a team of seven. We prototyped a website which would allow Software Engineering students to display how certain commits they had made demonstrated certain programming skills. While working on this, I also covered the entire technology stack (including the test frameworks we were using - JUnit and Cypress).</p>
                <p>This was our first year-long project with a large team. As such, the team struggled with cohesion and accountability, which (although inconvenient at the time) was a valuable learning experience that has prepared me well for the workplace.</p>
            </div>

            <div className="row-start grid-item">Third Law</div>
            <div className="grid-item"><a href='undefined' disabled target='_blank'>GDScript</a></div>
            <div className="grid-item">A larger game which I am working on, revolving around the concept of Newton's third law of motion (regarding equal and opposite reactions). This grew from a friend noticing that many games and engines ignore this. <span className='secondary-text-color'>A demo should be forthcoming soon!</span></div>

            <div className="row-start grid-item">Summoner's Apprentice</div>
            <div className="grid-item"><a href='https://github.com/octoscorp/LD55' target='_blank'>GDScript</a></div>
            <div className="grid-item"><p>My submission to the Ludum Dare 55 Game Jam. This was the first game I created in an engine, and was made in 48 hours. The <a href='https://antisage.itch.io/summoners-apprentice' target='_blank'>itch page</a> for this will eventually have a version compiled for web.</p></div>
        </div>
    )
}

export default ProjectsEducation