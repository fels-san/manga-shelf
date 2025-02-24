import axios from "axios";
import { Manga, MangaResponse } from "../types/types";

interface FetchMangaParams {
  limit?: number;
  ids?: string;
  order?: string;
  status?: string;
  season?: string;
  page?: number;
}

export const fetchManga = async ({
  limit,
  ids,
  order = "ranked",
  status,
  season,
  page = 1,
}: FetchMangaParams): Promise<Manga[]> => {
  const params = [
    limit ? `limit: ${limit}` : null,
    ids ? `ids: "${ids}"` : null,
    order ? `order: ${order}` : null,
    status ? `status: "${status}"` : null,
    season ? `season: "${season}"` : null,
    `page: ${page}`,
    `censored: true`,
    `kind: "manga"`,
  ]
    .filter(Boolean)
    .join(", ");

  const query = `
    query {
      mangas(${params}) {
        id
        name
        russian
        licenseNameRu
        licensors
        score
        poster {
          originalUrl
          mainUrl
        }
        descriptionHtml
        genres {
          russian
        }
        personRoles {
          rolesRu
          person { id name poster { id } }
        }
        publishers { id name }
        airedOn { year month day date }
        releasedOn { year month day date }
        chapters
        volumes
      }
    }
  `;

  const response = await axios.post(
    "https://shikimori.one/api/graphql",
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "MangaShelf",
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Ошибка загрузки манги");
  }

  const mangas: Manga[] = response.data.data.mangas.map(
    (mangaItem: MangaResponse) => ({
      id: mangaItem.id,
      poster: mangaItem.poster.originalUrl,
      miniPoster: mangaItem.poster.mainUrl,
      title: mangaItem.russian || mangaItem.name,
      originalTitle: mangaItem.name,
      licenseNameRu: mangaItem.licenseNameRu,
      licensors: mangaItem.licensors,
      description: mangaItem.descriptionHtml,
      score: mangaItem.score,
      genres: mangaItem.genres.map((genre) => genre.russian),
      authors: mangaItem.personRoles.map((role) => ({
        name: role.person.name,
        role: role.rolesRu.join(", ").toLowerCase(),
      })),
      publishers: mangaItem.publishers.map((publisher) => publisher.name),
      airedOn: mangaItem.airedOn,
      releasedOn: mangaItem.releasedOn,
      chapters: mangaItem.chapters,
      volumes: mangaItem.volumes,
    })
  );

  return mangas;
};
