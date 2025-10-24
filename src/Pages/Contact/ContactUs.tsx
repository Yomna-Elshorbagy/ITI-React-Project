import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`http://localhost:3000/contact`, data);
      return res.data;
    },
    onSuccess: (data) => {
      MySwal.fire({
        icon: "success",
        title: "Message Sent!",
        text: data.message || "Thank you for reaching out. We'll contact you soon.",
        confirmButtonColor: "var(--color-primary)",
      });
      setFormData({ fullName: "", email: "", message: "" });
    },
    onError: (error) => {
      MySwal.fire({
        icon: "error",
        title: "Oops!",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again later.",
        confirmButtonColor: "#b91c1c",
      });
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.message) {
      MySwal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all fields before submitting.",
      });
      return;
    }

    mutate(formData);
  };

  return (
    <section className=" bg-[ #F7E7CE] dark:bg-[var(--color-blue)]/85 transition-colors duration-500 py-16 px-6 sm:px-10 lg:px-20"> {/*dark:bg-gray-900 #fdfaf5ff  #F7E7CE #F6E7D7 #FAF9F7 #fdfaf5ff*/}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-[var(--color-header)] font-['Playfair_Display'] uppercase tracking-widest font-semibold text-lg md:text-2xl mb-4">
          Get in Touch                {/*<span className="text-[var(--color-primary)] text-4xl font-bold text-gray-800  "> */}
        </h1>
        <p className="font-['Playfair_Display']  text-[var(--color-blue)] dark:text-[var(--color-darkText)] leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto">  {/*text-gray-600 dark:text-gray-300 max-w-2xl mx-auto dark:text-gray-300 */}
          We’d love to hear from you! Whether you have a question about our
          jewelry, your order, or anything else — our team is ready to help.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 justify-between items-start header-font">
        <div className="flex-1 bg-gray-50 dark:bg-[#F4EDE1] p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="header-font text-2xl font-semibold text-[var(--color-blue)]/90 dark:text-[var(--color-blue)] mb-6"> {/* */}
            Contact Information
          </h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-[var(--color-blue)] text-xl" />
              <p className="text-gray-700 dark:text-[var(--color-blue)] "> {/*dark:text-gray-300 */}
                +20 123 456 7890
              </p>
            </div>

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-[var(--color-blue)] text-xl" />
              <p className="text-gray-700 dark:text-[var(--color-blue)]">
                support@kayanaccessories.com
              </p>
            </div>

            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-[var(--color-blue)] text-xl" />
              <p className="text-gray-700 dark:text-[var(--color-blue)]">
                Makram Ebeid, Nasr City, Cairo, Egypt
              </p>
            </div>
          </div>

          <div className="mt-10">
            <iframe
              title="Kayan Location — Makram Ebeid, Nasr City"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3382.0!2d31.3446!3d30.0683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840e3547c9c0f%3A0x0!2sMakram%20Ebeid%2C%20Nasr%20City%2C%20Cairo!5e0!3m2!1sen!2seg!4v1699999999999"
              className="w-full h-75 rounded-xl border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="flex-1 bg-gray-50 dark:bg-[#F4EDE1] p-8 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg">
          <h2 className="text-2xl font-semibold text-[var(--color-blue)]/90 dark:text-[var(--color-blue)] mb-6 ">
            Send Us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-[var(--color-blue)] mb-2 font-medium ">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-md border border-gray-300 border-gray-400 bg-white dark:bg-[#F4EDE1] text-gray-800 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-[var(--color-blue)] mb-2 font-medium ">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-md border border-gray-300 border-gray-400 bg-white dark:bg-[#F4EDE1]  text-gray-800 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-[var(--color-blue)] mb-2 font-medium">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message..."
                rows={5}
                className="w-full px-4 py-3 rounded-md border border-gray-300 border-gray-400  bg-white dark:bg-[#F4EDE1]  text-gray-800 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full py-3 font-medium rounded-md transition duration-300 dark:text-[#F4EDE1] ${
                isPending
                  ? "bg-[var(--color-blue)] cursor-not-allowed"
                  : "bg-[#C49A53] hover:bg-[var(--color-blue)] text-[var(--color-bg)]" //hover:opacity-90
              }`}
            >
              {isPending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
