import React from 'react';
import './AboutUs.css';
import missionImage from '../../Assets/missionPic1.jpg';
import visionImg from '../../Assets/visionPic1.jpg';
import chooseImg from '../../Assets/whyusPic1.jpg';
import teamImg from '../../Assets/team.png'

const AboutUs = () => {
    return (
        <div className="about-container">
            <section className="about-hero">
                <h1>About Us</h1>
                <p>Your journey to discovering the best parks starts here.</p>
            </section>

            <section className="about-section">
                <div className="about-text">
                    <h2>🌍 Our Mission</h2>
                    <p>At ParkFinder, our mission is to make outdoor adventures
                        effortless and accessible for everyone. We help nature 
                        enthusiasts, families, and fitness lovers discover the 
                        perfect park—right at their fingertips. Whether you're 
                        looking for a scenic trail, a playground for kids, a 
                        pet-friendly space, or sports facilities, ParkFinder 
                        connects you to the best parks near you based on your 
                        preferences and needs. With our user-friendly platform, 
                        finding your next outdoor destination has never been 
                        easier!
                    </p>
                </div>
                <div className="about-image">
                    <img src={missionImage} alt="Mission" />
                </div>
            </section>

            <section className="about-section reverse">
                <div className="about-text">
                    <h2>🚀 Our Vision</h2>
                    <p>Our vision is to create a world where everyone can easily connect
                    with nature and enjoy the outdoors. We strive to be the go-to 
                    platform for discovering parks, helping users find the perfect 
                    spot for relaxation, adventure, or recreation. By leveraging 
                    technology, we aim to make outdoor exploration seamless, inspiring
                    more people to embrace a healthier, more active lifestyle 
                    while appreciating the beauty of green spaces around them.
                    </p>
                </div>
                <div className="about-image">
                    <img src={visionImg} alt="Vision" />
                </div>
            </section>

            <section className="about-section">
                <div className="about-text">
                    <h2>📢 Why Choose Us?</h2>
                    <p>ParkFinder is designed with outdoor lovers in mind, making it easier 
                    than ever to find the perfect park for any activity. Our platform 
                    offers a seamless experience, allowing you to search for parks based
                    on location, amenities, and personal preferences. Whether you need a 
                    dog-friendly park, a hiking trail, or a picnic area, we provide accurate
                    and up-to-date information to match your needs. With a user-friendly 
                    interface and a commitment to helping you explore the outdoors effortlessly,
                    ParkFinder is your ultimate guide to discovering the best parks near you.
                    </p>
                </div>
                <div className="about-image">
                    <img src={chooseImg} alt="Why Choose Us" />
                </div>
            </section>
            <section className="about-team">
                <h2>👥 Meet Our Team</h2>
                <div className="team-container">
                    <div className="team-member">
                        <img src={teamImg} alt="Team Member" className="team-img" />
                        <h3>Tanvir Ahmed</h3>
                    </div>
                    <div className="team-member">
                    <img src={teamImg} alt="Team Member" className="team-img" />
                        <h3>Abu Tashin</h3>
                    </div>
                    <div className="team-member">
                    <img src={teamImg} alt="Team Member" className="team-img" />
                        <h3>Farhan Kabiri</h3>
                    </div>
                    <div className="team-member">
                    <img src={teamImg} alt="Team Member" className="team-img" />
                        <h3>Asifur Asif</h3>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
