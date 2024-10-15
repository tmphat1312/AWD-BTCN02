"use client";

import { db, Photo } from "@/data/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function PhotosPage() {
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
    return (
      <Layout>
        <p className="sr-only">Loading</p>
        <ImagesSkeleton />
      </Layout>
    );
  }

  if (status == "error") {
    return (
      <Layout>
        <p className="text-center text-2xl text-red-500">
          Error when loading photos!
        </p>
      </Layout>
    );
  }

  const photos = data.pages.flatMap((page) => page.data);

  return (
    <Layout>
      <Images images={photos} />
      <div ref={loadMoreRef}></div>
      {isFetchingNextPage && (
        <p className="text-center text-xl animate-pulse mt-4 font-medium">
          Loading more...
        </p>
      )}
      {!hasNextPage && (
        <p className="text-center mt-4 font-medium text-xl">No more photos</p>
      )}
    </Layout>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
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
      {children}
    </section>
  );
}

function Images({ images }: { images: Photo[] }) {
  return (
    <ul className="w-full grid justify-center sm:grid-cols-2 md:grid-cols-3 gap-4 xl:grid-cols-4">
      {images.map((photo) => (
        <li
          key={photo.id}
          className="border rounded-md overflow-clip shadow bg-gray-50"
        >
          <Link href={`/photos/${photo.id}`} className="group">
            <Image
              className="rounded-sm w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300 brightness-90 group-hover:brightness-100 transition-brightness"
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

function ImagesSkeleton() {
  return (
    <div
      className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 xl:grid-cols-4"
      role="presentation"
    >
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          className="place-content-center rounded-md overflow-clip shadow bg-gray-50"
        >
          <div className="w-full h-[200px] animate-pulse bg-gray-300"></div>
          <div className="py-2">
            <div className="w-1/5 h-[18px] mx-auto bg-gray-300 animate-pulse rounded mb-1"></div>
            <div className="w-1/2 h-6 mx-auto bg-gray-300 animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
