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
};

export type HttpResponse<T> = {
  data: T;
  next: number;
};

async function getPhotos({
  page = 1,
}: {
  page?: number;
}): Promise<HttpResponse<Photo[]>> {
  const params = new URLSearchParams();
  params.append("_page", page.toString());
  params.append("_per_page", "12");

  // wait 500ms
  await new Promise((resolve) => setTimeout(resolve, 500));

  const resp = await fetch(`http://localhost:3000/photos?${params}`);
  return resp.json();
}

async function getPhotoById(id: string): Promise<Photo> {
  const resp = await fetch(`http://localhost:3000/photos/${id}`);
  return resp.json();
}

export const db = {
  query: {
    getPhotos,
    getPhotoById,
  },
};
