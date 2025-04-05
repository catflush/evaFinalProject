function Hero() {
  {
    /* Hero Section */
  }
  <div className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
    <div className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <button className="inline-flex mb-2">New Release</button>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Streamline your workflow like never before
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              The all-in-one platform that helps teams collaborate, manage
              projects, and deliver results faster.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <button size="lg" className="h-12">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button size="lg" variant="outline" className="h-12">
              Book a Demo
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            No credit card required. Start your 14-day free trial today.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px]">
            <img
              src="/placeholder.svg?height=500&width=500"
              alt="StreamLine Dashboard"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export default Hero;
