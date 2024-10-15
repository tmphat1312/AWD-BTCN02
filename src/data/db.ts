export type Photo = {
  id: string;
  slug: string;
  width: number;
  height: number;
  urls: {
    thumb: string;
    raw: string;
    small: string;
  };
  description: string;
  alt_description: string;
  user: {
    name: string;
  };
  blur_hash: string;
};

export type HttpResponse<T> = {
  data: T;
  next: number | null;
};

async function getPhotos({
  page = 1,
}: {
  page?: number;
}): Promise<HttpResponse<Photo[]>> {
  const params = new URLSearchParams();
  params.append("client_id", process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!);
  params.append("page", page.toString());
  params.append("per_page", "12");

  // wait for 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  const resp = await fetch(`https://api.unsplash.com/photos?${params}`);
  const totalPhotos = resp.headers.get("x-total")!;
  const perPage = resp.headers.get("x-per-page")!;
  const totalPages = Math.ceil(parseInt(totalPhotos) / parseInt(perPage));

  return {
    data: await resp.json(),
    next: page < totalPages ? page + 1 : null,
  };
}

async function getPhotoById(id: string): Promise<Photo> {
  const params = new URLSearchParams();
  params.append(
    "client_id",
    process.env.UNSPLASH_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!
  );
  const resp = await fetch(`https://api.unsplash.com/photos/${id}?${params}`);
  return resp.json();
}

export const db = {
  query: {
    getPhotos,
    getPhotoById,
  },
};
