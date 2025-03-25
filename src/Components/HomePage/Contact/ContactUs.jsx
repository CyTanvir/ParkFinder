import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>Have any questions? Feel free to reach out to us!</p>

      <form className="contact-form">
        <label>Name</label>
        <input type="text" placeholder="Enter your name" required />

        <label>Email</label>
        <input type="email" placeholder="Enter your email" required />

        <label>Message</label>
        <textarea placeholder="Write your message here..." required></textarea>

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactUs;
