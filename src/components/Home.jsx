import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { UserCircle2, BookOpen, Users, MessageCircle } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle header scroll animation
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Cleanup scroll event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for elements with .animate-on-scroll
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 } // 10% visibility triggers animation
    );

    elements.forEach((el) => observer.observe(el));

    // Cleanup IntersectionObserver
    return () => observer.disconnect();
  }, []);

  return (
    <div className="main-container">
      {/* Header Section */}
      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section animate-on-scroll">
          <h3>Transform Your Future with Expert Mentorship</h3>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-widget">
              <BookOpen className="feature-icon" />
              <h4>Personalized Learning</h4>
              <p>Tailored guidance for your unique journey</p>
            </div>
            <div className="feature-widget">
              <Users className="feature-icon" />
              <h4>Expert Network</h4>
              <p>Connect with industry-leading mentors</p>
            </div>
            <div className="feature-widget">
              <MessageCircle className="feature-icon" />
              <h4>Interactive Support</h4>
              <p>Real-time guidance when you need it</p>
            </div>
          </div>
        </section>

        {/* Mentor Explorer */}
        <section className="mentor-section">
          <h3>Explore Mentors</h3>
          <div className="mentor-grid">
            {[1, 2, 3].map((mentor, index) => (
              <div key={mentor} className="mentor-card">
                <UserCircle2 className="mentor-avatar" />
                <div className="mentor-info">
                  <h4>
                    {index === 0 && "Sarah Chen"}
                    {index === 1 && "Michael Rodriguez"}
                    {index === 2 && "Priya Patel"}
                  </h4>
                  <p>
                    {index === 0 && "Expert in Frontend Development"}
                    {index === 1 && "Expert in Backend Systems"}
                    {index === 2 && "Expert in Mobile Development"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <h3>Student Success Stories</h3>
          <div className="testimonials-grid">
            {[1, 2].map((testimonial, index) => (
              <div key={testimonial} className="testimonial-card">
                <p>
                  {index === 0 && 
                    "The mentorship program helped me transition from a junior to senior developer position in just 8 months!"}
                  {index === 1 && 
                    "Thanks to my mentor's guidance, I successfully launched my first full-stack application."}
                </p>
                <div className="student-info">
                  <UserCircle2 className="student-avatar" />
                  <div>
                    <h4>
                      {index === 0 && "David Kim"}
                      {index === 1 && "Emma Thompson"}
                    </h4>
                    <p>
                      {index === 0 && "Senior Frontend Developer"}
                      {index === 1 && "Full Stack Developer"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
    </div>
  );
};

export default Home;