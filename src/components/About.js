import React from 'react'
import { Link } from 'react-router-dom'

function About() {
    return (
        <div className="centre-container">
            <h2 className="logo-font font--extra-large">About Me <hr /></h2>
            <p>Kia ora! My name is George, and I'm a recently graduated Software Engineer from Christchurch, New Zealand. If 
            you are here considering hiring me, I recommend checking out the <Link to='/coding'>coding</Link> subpage to
            point you to my previous work.</p>
            <br />
            <h3 className="font--medium ">Professional Interests</h3>
            <p>In the software space, my interests are chiefly in <span className='secondary-text-color'>security, user experience, and quality assurance</span>. As an end
            user of software products, I see far too many preventable issues on these fronts. As a software developer myself,
            I see this as an opportunity for improvements in the industry.</p>
            <br />
            <h3 className="font--medium ">Personal Interests</h3>
            <p>My personal interests can be quite diverse. I enjoy playing and making games (of both board and video varieties),
            playing guitar, baking, and woodworking. With the exception of where these intersect with code, many of these may not be featured
            on this site - note that this doesn't mean they aren't happening in the background!</p>
        </div>
    )
}

export default About
