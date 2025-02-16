import React, { useEffect } from 'react';
import { Users, Target, Award, Heart, Linkedin, Twitter, Facebook } from 'lucide-react';
import './Global.css';

const About = () => {
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
      {/* Hero Section */}
      <section className="section-padding" style={{backgroundColor: '#EFEDE8'}}>
        <div className="container">
          <div className="animate-on-scroll">
            <center>
            <h1 className="section-title">About MentorConnect</h1>
            <p className="text-center text-lg mb-8">
           
              Empowering the next generation of professionals through expert mentorship
            </p>
            </center>
            
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding" style={{backgroundColor: '#9DC2C8'}}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="animate-on-scroll">
              
            </div>
            <div className="animate-on-scroll bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-[#0BB8AE]">Our Mission</h2>
              <p className="mb-4 text-gray-600 leading-relaxed">
                At MentorConnect, we believe that personalized mentorship is the key to accelerating professional growth in the tech industry. Our platform connects aspiring developers with experienced mentors who can guide them through their journey.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We're committed to creating an inclusive environment where knowledge sharing and skill development thrive, enabling both mentors and mentees to reach their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="contact-card animate-on-scroll">
              <div className="card-icon">
                <Users className="w-8 h-8 text-[#0BB8AE]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-600">Building strong connections within the tech community</p>
            </div>
            <div className="contact-card animate-on-scroll">
              <div className="card-icon">
                <Target className="w-8 h-8 text-[#0BB8AE]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">Striving for the highest quality in mentorship</p>
            </div>
            <div className="contact-card animate-on-scroll">
              <div className="card-icon">
                <Award className="w-8 h-8 text-[#0BB8AE]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-gray-600">Fostering continuous learning and development</p>
            </div>
            <div className="contact-card animate-on-scroll">
              <div className="card-icon">
                <Heart className="w-8 h-8 text-[#0BB8AE]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Impact</h3>
              <p className="text-gray-600">Making a real difference in careers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding" style={{backgroundColor: '#9DC2C8'}}>
        <div className="container">
          <h2 className="section-title mb-12">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "CEO & Founder",
                image: "/api/placeholder/300/300",
                bio: "Former Tech Lead at Google with 15+ years of experience"
              },
              {
                name: "Michael Rodriguez",
                role: "Head of Mentorship",
                image: "/api/placeholder/300/300",
                bio: "10+ years experience in developer education and training"
              },
              {
                name: "Priya Patel",
                role: "Community Director",
                image: "/api/placeholder/300/300",
                bio: "Expert in building and scaling developer communities"
              }
            ].map((member, index) => (
              <div key={index} className="contact-card animate-on-scroll">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                <p className="text-[#0BB8AE] text-center mb-2">{member.role}</p>
                <p className="text-gray-600 text-center">{member.bio}</p>
                <div className="flex justify-center gap-4 mt-4">
                  <a href="#" className="text-[#0BB8AE] hover:text-[#099a9a] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-[#0BB8AE] hover:text-[#099a9a] transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;