export interface VideoCardData {
  id: string;
  title: string;
  tag: string;
  duration: string;
}

export interface VideoDetailsData extends VideoCardData {
  description: string;
  publicationDate: string;
}

// In a production project, this catalogue would be retrieved from the backend.
const videoCards: VideoCardData[] = [
  {
    id: "content_item_amsterdam",
    title: "Amsterdam from above",
    tag: "Travel",
    duration: "02:30",
  },
  {
    id: "content_item_newsroom",
    title: "Inside the newsroom",
    tag: "News",
    duration: "04:05",
  },
  {
    id: "content_item_morning",
    title: "Morning news update",
    tag: "News",
    duration: "01:35",
  },
  {
    id: "content_item_technology",
    title: "Technology of tomorrow",
    tag: "Technology",
    duration: "05:20",
  },
  {
    id: "content_item_travel",
    title: "Weekend travel guide",
    tag: "Travel",
    duration: "03:30",
  },
  {
    id: "content_item_interview",
    title: "Interview of the day",
    tag: "Interviews",
    duration: "06:40",
  },
];

export const getVideoCards = (): VideoCardData[] => [...videoCards];

export const getRandomVideoCard = (): VideoCardData => {
  const cards = getVideoCards();
  return cards[Math.floor(Math.random() * cards.length)];
};

export const getAmsterdamVideo = (): VideoDetailsData => ({
  ...videoCards[0],
  description:
    "Explore Amsterdam and its surroundings from a different perspective.",
  publicationDate: "15 July 2026",
});
