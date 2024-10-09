// ContactForm.jsx
import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Message sent: ${formData.message}`);
    setFormData({ name: "", email: "", message: "" , number: "", subject: "" });
  };

  return (
    <div>
      <div className="xl:flex justify-between">
        <div>
          <form className="max-w-lg mx-auto space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-3xl font-semibold">Contact Us</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <input 
              type="number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Your Number"
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="4"
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Send Message
            </button>
          </form>
        </div>
        <div>
          <img className="w-50" src="https://dobernut.com/wp-content/uploads/2024/09/gang-of-3-dogs-all-stting.webp" alt="" />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
