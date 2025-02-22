export const cleanDescription = (description: string) => {
  if (!description) return description;
  return description.replace(/\[character=\d+](.*?)\[\/character]/g, "$1");
};

export const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const getValidDate = (dateObj?: {
  year: number | null;
  month: number | null;
  day: number | null;
}) => {
  if (dateObj && dateObj.year && dateObj.month && dateObj.day) {
    return new Date(dateObj.year, dateObj.month - 1, dateObj.day);
  }
  return null;
};

export const formatMangaDate = (
  startDate: Date | null,
  endDate: Date | null
) => {
  if (!startDate) return "Дата неизвестна";

  const optionsFull = {
    day: "numeric",
    month: "long",
    year: "numeric",
  } as const;

  if (!endDate) {
    return `Выходит с ${startDate.toLocaleDateString("ru-RU", optionsFull)}`;
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameDate = startDate.getTime() === endDate.getTime();

  if (sameDate) {
    return `Издано ${startDate.toLocaleDateString("ru-RU", optionsFull)}`;
  } else if (sameYear) {
    return `Издано с ${startDate.toLocaleDateString(
      "ru-RU",
      optionsFull
    )} по ${endDate.toLocaleDateString("ru-RU", optionsFull)}`;
  } else {
    return `Издано в ${startDate.getFullYear()}-${endDate.getFullYear()} гг.`;
  }
};

export const getMangaAwards = (mangaId, mangaAwards) => {
  const winnerAwards = [];

  for (const awardKey in mangaAwards) {
    const award = mangaAwards[awardKey];

    for (const year in award.winners) {
      if (award.winners[year].includes(mangaId)) {
        winnerAwards.push({ key: awardKey, title: `${award.name} ${year}` });
        break; // Выходим из внутреннего цикла, если нашли мангу в этой премии
      }
    }
  }

  return winnerAwards.length > 0 ? winnerAwards : null;
};
