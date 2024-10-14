"use client";

import { db, Photo } from "@/data/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";

function Images({ images }: { images: Photo[] }) {
  return (
    <ul>
      {images.map((photo) => (
        <li key={photo.id}>
          <Image
            width={200}
            height={133}
            src={photo.urls.thumb}
            alt={photo.alt_description}
          />
        </li>
      ))}
    </ul>
  );
}

export default function Photos() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["photos"],
      queryFn: ({ pageParam }) => db.query.getPhotos({ page: pageParam }),
      getNextPageParam: (lastPage) => lastPage.next,
    });

  if (status == "pending") {
    return <p>Loading...</p>;
  }

  if (status == "error") {
    return <p>Error!</p>;
  }

  console.log(data.pages.flat());

  return (
    <ul>
      {data.pages.map((page) => (
        <Images images={page.data} key={page.next} />
      ))}
    </ul>
  );
}
