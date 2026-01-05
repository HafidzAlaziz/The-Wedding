import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import About from "@/components/About";
import Event from "@/components/Event";
import Gallery from "@/components/Gallery";
import Quote from "@/components/Quote";
import RegisterForm from "@/components/RegisterForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen bg-wedding-cream relative">
      <LoadingScreen />
      <Navbar />
      <Hero />
      <div id="about">
        <About />
      </div>
      <Countdown />
      <div id="event">
        <Event />
      </div>
      <div id="gallery">
        <Gallery />
      </div>
      <Quote />
      <div id="rsvp">
        <RegisterForm />
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}
