export const showroomName = "AURALUXE MOTORS";

export function getShowroomBrand(brand) {
  const normalizedBrand = brand?.trim();
  return normalizedBrand && normalizedBrand.toUpperCase() !== "FAHAM LUXE MOTORS" ? normalizedBrand : showroomName;
}

export const originalSlides = [
  { image: "/cars/audi.jpeg", title: "Find Your Dream Car", description: "Discover a carefully selected range of premium vehicles.", make: "Audi" },
  { image: "/cars/sport.jpeg", title: "Select Your Next Car", description: "Explore the collection and choose a car that fits your life.", make: "Sports cars" },
  { image: "/cars/merceds.jpeg", title: "Explore Your Dream Drive", description: "Distinctive design, refined comfort and a better way to choose.", make: "Mercedes-Benz" }
];

export const originalInventory = [
  { _id: "original-audi", make: "Audi", model: "Featured car", bodyStyle: "Luxury", image: "/cars/audi.jpeg", description: "A refined drive with comfort and confidence for every journey." },
  { _id: "original-mark-x", make: "Mark-X", model: "Car Outlets", bodyStyle: "SUV", image: "/cars/2.jpeg", description: "A spacious, versatile option ready for everyday adventures." },
  { _id: "original-bmw", make: "BMW", model: "Featured car", bodyStyle: "Sports", image: "/cars/s.jpg", description: "A distinctive sports selection with an unmistakable road presence." },
  { _id: "original-lexus", make: "Lexus LX", model: "Car Outlets", bodyStyle: "Economy", image: "/cars/c.jpg", description: "Explore a considered option with room for the whole journey." }
];

export const originalStories = [
  {
    image: "/cars/1.jpeg",
    category: "PERFORMANCE",
    title: "Made for the open road.",
    description: "Explore confident handling, responsive performance and the feeling that makes every drive worth taking."
  },
  {
    image: "/cars/panamera.jpg",
    category: "PREMIUM SELECTION",
    title: "Comfort in every detail.",
    description: "A considered premium collection brings craftsmanship, thoughtful design and everyday comfort together."
  },
  {
    image: "/cars/audi.jpeg",
    category: "THE AURALUXE EXPERIENCE",
    title: "Find the right fit.",
    description: "From your first shortlist to your final choice, our team helps make your next-car search feel straightforward."
  },
  {
    image: "/cars/c.jpg",
    category: "CARE & SUPPORT",
    title: "Here for the whole journey.",
    description: "Get clear answers and personal guidance from the first enquiry through to your handover."
  },
  {
    image: "/cars/camaro-blue.jpg",
    category: "SPORTS COLLECTION",
    title: "A bold first impression.",
    description: "Discover expressive design and an unmistakable road presence in our sports-car selection."
  },
  {
    image: "/cars/camaro-night.jpg",
    category: "CURATED CARS",
    title: "Something worth looking back at.",
    description: "Browse distinctive vehicles selected to make a statement, with details available from our team."
  },
  {
    image: "/cars/suv-showcase.jpg",
    category: "SPACE & VERSATILITY",
    title: "Room for more journeys.",
    description: "Explore versatile SUV options with the space and comfort to bring more along for the ride."
  },
  {
    image: "/cars/merceds.jpeg",
    category: "PREMIUM DRIVING",
    title: "Your next chapter starts here.",
    description: "See the current collection, compare vehicle details and send a booking request to our showroom."
  }
];

export const featureStories = [
  {
    image: "/cars/m.jpg",
    title: "A more personal way to find your next car.",
    description: "Tell us what you are looking for. The AURALUXE team can help you explore vehicle details, availability and the next steps."
  },
  {
    image: "/cars/suv-showcase.jpg",
    title: "A collection for every kind of journey.",
    description: "From refined daily drives to versatile family SUVs and performance cars, explore the available collection and ask our team for details."
  },
  {
    image: "/cars/camaro-blue.jpg",
    title: "Make your next drive memorable.",
    description: "View the vehicle specifications, share your preferred date and send a no-obligation booking request for the car you have in mind."
  },
  {
    image: "/cars/panamera.jpg",
    title: "Clear details. A confident choice.",
    description: "We are here to answer your questions about mileage, features and availability so you can decide at your own pace."
  }
];
