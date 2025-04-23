import React, { useState, useEffect } from "react";
import "./ContactUs.css";
import { db } from "../../firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: Timestamp.now()
      });

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert("❌ Failed to send message. Please try again.");
    }
  };

  // Auto-hide success message after 4 seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>Have any questions or feedback? We'd love to hear from you!</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Write your message here..."
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>

          <button type="submit">Send Message</button>
          {submitted && (
            <div className="success-animation">
              <div className="checkmark-circle">
            <svg className="checkmark-icon" viewBox="0 0 52 52">
              <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14 27l7 7 17-17" />
            </svg>
          </div>
          <p>Message sent successfully!</p>
        </div>
)}
  

        </form>
      </div>
    </div>
  );
};

export default ContactUs;
