import { APP_NAME } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-6">About {APP_NAME}</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            {APP_NAME} is a platform for building production-ready applications from day one.
            We provide everything developers need — authentication, database, monitoring, and cloud deployment — 
            all integrated and working together out of the box.
          </p>
          <p>
            Our mission is to eliminate the tedious infrastructure work that keeps developers from building 
            great products. With {APP_NAME}, you focus on your application logic while we handle the rest.
          </p>
          <h2 className="text-2xl font-bold text-foreground pt-4">Our Story</h2>
          <p>
            Founded in 2024, {APP_NAME} was born from the frustration of repeatedly setting up the same 
            infrastructure for every new project. We believe developers should spend their time building 
            features, not configuring servers.
          </p>
          <p>
            Backed by Y Combinator, we&apos;re building the future of application development — where 
            production-ready is the default, not the exception.
          </p>
          <h2 className="text-2xl font-bold text-foreground pt-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Developer experience first — every feature is designed to be intuitive</li>
            <li>Production-ready by default — no compromises on quality</li>
            <li>No lock-in — you always own your code and data</li>
            <li>Transparent pricing — pay only for what you use</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
