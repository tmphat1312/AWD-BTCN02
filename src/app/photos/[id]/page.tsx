import { db } from "@/data/db";
import Image from "next/image";

export default async function Photo({ params }: { params: { id: string } }) {
  const photo = await db.query.getPhotoById(params.id);
  return (
    <section className="text-center">
      <h2 className="text-xl md:text-2xl font-medium text-center text-balance">
        {photo.alt_description}
      </h2>
      <h3>
        <span>Published by</span>
        <span className="font-semibold text-balance"> {photo.user.name}</span>
      </h3>
      <p>
        Sizes:{" "}
        <span className="font-medium">
          {photo.width}x{photo.height}
        </span>
      </p>
      <p className="w-fit mx-auto max-w-[60ch] italic">
        {photo.description ?? "No description"}
      </p>
      <Image
        className="mt-2 bg-gray-200"
        src={photo.urls.raw}
        alt={photo.alt_description}
        width={photo.width}
        height={photo.height}
        blurDataURL={photo.blur_hash}
      />
    </section>
  );
}
