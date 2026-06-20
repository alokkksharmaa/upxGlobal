import React from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/landing/Hero";
import About from "../../components/landing/About";
import Services from "../../components/landing/Services";
import CheckoutProcess from "../../components/landing/CheckoutProcess";
import WhyChooseUs from "../../components/landing/WhyChooseUs";
import Testimonials from "../../components/landing/Testimonials";
import FAQ from "../../components/landing/FAQ";
import ContactForm from "../../components/landing/ContactForm";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <CheckoutProcess />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
