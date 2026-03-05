import ImageCropper from "../components/ImageCropper";

export default function ToolHome() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12 animate-fade-in">
          <div className="inline-block">
            <h1 className="heading text-center animate-fade-up pt-5">
              Image Cropper
            </h1>
            <div className="h-1 bg-gradient-primary rounded-full"></div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crop your images to the perfect size with ease. Supports various aspect ratios and zoom controls.
          </p>
        </div>

       <div
  className="
    bg-(--card) border-(--border) rounded-xl shadow-md
    mx-4 my-6 px-4 py-6
    sm:mx-8 sm:px-6
    md:mx-12 md:px-8
    lg:ml-64 lg:mr-12 lg:my-16
  "
>
  <ImageCropper />
</div>

      </div>
     
    </div>
  );
};

