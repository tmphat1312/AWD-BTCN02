export type Photo = {
  id: string;
  slug: string;
  urls: {
    thumb: string;
  };
  alt_description: string;
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
  params.append("_per_page", "2");

  const resp = await fetch(`http://localhost:3000/photos?${params}`);
  return resp.json();
}

export const db = {
  query: {
    getPhotos,
  },
};
