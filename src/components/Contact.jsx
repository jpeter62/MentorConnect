import React, { useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Linkedin,
  Twitter,
  Facebook
} from 'lucide-react';
import './Global.css';

const Contact = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-wrapper">
      <section className="section-padding" style={{backgroundColor: '#EFEDE8'}}>
        <div className="container">
          <div className="text-center animate-on-scroll">
            <h1 className="section-title">Get in Touch</h1>
            <center>
            <p className="text-lg mb-8">
              Have questions about mentorship? We're here to help!
            </p>
            </center>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding" style={{backgroundColor: '#9DC2C8'}}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="contact-card animate-on-scroll">
              <div className="card-icon">
                <Mail className="w-8 h-8 text-[#0BB8AE]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-600">info@mentorconnect.com</p>
              <p className="text-gray-600">support@mentorconnect.com</p>
            </div>
            <div className="contact-card animate-on-scroll">
              <div className="card-icon">
                <Phone className="w-8 h-8 text-[#0BB8AE]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-600">Mon-Fri, 9am-6pm EST</p>
            </div>
            <div className="contact-card animate-on-scroll">
              <div className="card-icon">
                <MapPin className="w-8 h-8 text-[#0BB8AE]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-600">123 Tech Avenue</p>
              <p className="text-gray-600">New York, NY 10001</p>
            </div>
            <div className="contact-card animate-on-scroll">
              <div className="card-icon">
                <Clock className="w-8 h-8 text-[#0BB8AE]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Working Hours</h3>
              <p className="text-gray-600">Monday - Friday</p>
              <p className="text-gray-600">9:00 AM - 6:00 PM EST</p>
            </div>
          </div>
        </div>
      </section>

      {/* Follow Us Section */}
      

      {/* Map Section */}
      <section className="section-padding" style={{ backgroundColor: '#9DC2C8' }}>
        <div className="container">
          <div className="rounded-lg overflow-hidden shadow-xl animate-on-scroll">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.9197381695367!2d-74.0060151242018!3d40.71277603815792!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a3169b77b5b%3A0x9e9b7ef4b0e8a64d!2sOne%20World%20Trade%20Center!5e0!3m2!1sen!2sus!4v1700000000000"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
