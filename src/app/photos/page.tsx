"use client";

import { db, Photo } from "@/data/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Photos() {
  const { data, fetchNextPage, hasNextPage, status, isFetchingNextPage } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["photos"],
      queryFn: ({ pageParam }) => db.query.getPhotos({ page: pageParam }),
      getNextPageParam: (lastPage) => lastPage.next,
    });
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observedElement = loadMoreRef.current;

    if (!observedElement) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
    });

    observer.observe(observedElement);
    return () => observer.unobserve(observedElement);
  }, [hasNextPage, fetchNextPage]);

  if (status == "pending") {
    // TODO: skeleton here
    return <p>Loading...</p>;
  }

  if (status == "error") {
    // TODO: proper error here
    return <p>Error!</p>;
  }

  const photos = data.pages.flatMap((page) => page.data);

  return (
    <section className="mb-20">
      <h2 className="text-xl md:text-2xl font-medium text-center mb-2.5 md:mb-4">
        <span>Photos from </span>
        <Link
          href="https://unsplash.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Unsplash
        </Link>
      </h2>
      <Images images={photos} />
      <div ref={loadMoreRef}></div>
      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>No more photos</p>}
    </section>
  );
}

function Images({ images }: { images: Photo[] }) {
  return (
    <ul className="grid justify-center sm:grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((photo) => (
        <li
          key={photo.id}
          className="border rounded-md overflow-clip shadow bg-gray-50"
        >
          <Link href={`/photos/${photo.id}`} className="group">
            <Image
              className="rounded-sm w-[400px] h-[200px] object-cover group-hover:scale-105 transition-transform duration-300 brightness-90 group-hover:brightness-100 transition-brightness"
              width={400}
              height={200}
              src={photo.urls.small}
              alt={photo.alt_description}
            />
            <section className="text-center py-2 group-hover:underline underline-offset-2">
              <span className="text-sm italic">Published by</span>
              <h3 className="font-medium">{photo.user.name}</h3>
            </section>
          </Link>
        </li>
      ))}
    </ul>
  );
}
