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
                <p>Python (Django framework)</p>
                <p>JavaScript</p>
            </div>
            <div className="grid-item">
                <p>This was my final year project, for which I was working solo with supervision. I extended the existing CodeWOF website with a page for adding questions to the database. This covered the full technology stack, from designing and implementing the frontend page down to changing some aspects of the database structure.</p>
                <p>This served well as a learning experience, but isn't my proudest work. I was too ambitious in what I hoped to complete, and found myself struggling to commit the time which the sizable technology stack and limited documentation required. It serves as a good example for me of the importance of code maintainability.</p>
            </div>

            <div className="row-start grid-item">LensFolio</div>
            <div className="grid-item">
                <p>Java (Spring Framework)</p>
                <p>Thymeleaf (an HTML templating framework)</p>
                <p>JavaScript</p>
            </div>
            <div className="grid-item">
                <p>This was my third-year project, as part of a team of seven. We prototyped a website which would allow Software Engineering students to display how certain commits they had made demonstrated certain programming skills. While working on this, I also covered the entire technology stack (including the test frameworks we were using - JUnit and Cypress).</p>
                <p>This was our first year-long project with a large team. As such, the team struggled with cohesion and accountability, which (although inconvenient at the time) was a valuable learning experience that has prepared me well for the workplace.</p>
            </div>

            <div className="row-start grid-item">Island Trading Game</div>
            <div className="grid-item">
                <a href='https://github.com/jdmccork/deckGame' target='_blank'>Java (using Java Swing for GUI)</a>
            </div>
            <div className="grid-item">
                <p>A small game created as part of a pair for a course in which we learnt Java and common OOP patterns.</p>
                <p>The course recommended we create a MVP of the game in text-only form, then extend it to add GUI elements. We fell right into the trap of having methods which assumed the text output format instead of being generalised to either option, and learnt valuable lessons about maintainability and foresight from the refactoring this caused.</p>
                <p>With those lessons of maintainability in mind, I then designed and implemented a modular button system which allowed for all buttons in the game to implement the same class, greatly increasing our development speed.</p>
            </div>
        </div>
    )
}

export default ProjectsEducation