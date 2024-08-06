import React from 'react'
import ProjectsPersonal from './ProjectsPersonal'
import ProjectsEducation from './ProjectsEducation'

function Coding() {
    return (
        <div className="centre-container">
            <h2 className="logo-font font--extra-large">Coding <hr /></h2>
            <p>I have experience programming in numerous languages and believe that I have a solid grasp of the underlying logic, allowing me to learn new languages swiftly.
            Additionally, I have experience with both solo and group projects (in various sized teams, typically using the Scrum process).</p> <br />
            <details open><summary className="secondary-text-color font--medium">Programming Languages</summary>
            In experience order:
            <ul className="plain-list">
                <li>Python</li>
                <li>JavaScript</li>
                <li>C/C++</li>
                <li>Java</li>
                <li>GDScript</li>
                <li>SQL</li>
                <li>TypeScript</li>
                <li>MATLAB</li>
                <li>Bash</li>
                <li>TeX</li>
                <li className="secondary-text-color font--small">Languages beyond this point have mostly slipped my memory, but should be fast to re-learn.</li>
                <li>Lua</li>
                <li>Prolog</li>
                <li>Go</li>
                <li>PHP</li>
            </ul>
            <p className="font--small">Additionally, I am very familiar with HTML, CSS, and SCSS, as well as the JQuery, Bootstrap, and React frameworks.</p>
            </details>
            <br />
            <details><summary className="bright-lighter-text-color font--medium"><b>Professional Experience</b></summary>
            <p>I have completed one internship with Allied Telesis Labs (Nov 2021 - Feb 2022), during the course of which I used the Scrum process in a small team to prototype implementations in line with networking RFC specifications.</p>
            </details>
            <br />
            <details><summary className="bright-lighter-text-color font--medium"><b>Educational Experience</b></summary>
            <p>I've been programming since 2016 in some form or another, thanks to taking digital technology in high school. The projects I've learnt the most from are shown below.</p>
            <ProjectsEducation />
            </details>
            <br />
            <details><summary className="bright-lighter-text-color font--medium"><b>Personal Projects</b></summary>
            <p>Some of my more significant personal projects in coding are highlighted in the table below.</p>
            <ProjectsPersonal />
            </details>
            <br />
        </div>
    )
}

export default Coding
