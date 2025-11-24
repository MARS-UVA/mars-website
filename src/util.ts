import { getCollection } from "astro:content";

const peopleCollection = await getCollection("people");

const getYearPictureSrc = (
    person: (typeof peopleCollection)[number],
    type: "professional" | "profile",
    year: number,
): string | null => {
    const pictures =
        type === "professional"
            ? person.data.professionalPictures
            : person.data.profilePictures;

    if (pictures) {
        // Find pictureSrc for the given year
        const pictureForYear = pictures.find((pic) => pic.year === year);
        if (pictureForYear) return pictureForYear.src;
    }

    // Default to defaultProfilePicture
    if (type === "professional") {
        const defaultPic = person.data.defaultProfessionalPicture;
        if (!defaultPic) return null;
        const src = person.data.professionalPictures?.find(
            (pic) => pic.year === defaultPic.year,
        )?.src;
        if (src) return src;
    }

    const defaultPic = person.data.defaultProfilePicture;
    if (!defaultPic) return null;
    const src = person.data.profilePictures?.find(
        (pic) => pic.year === defaultPic.year,
    )?.src;
    if (src) return src;

    return null;
};

export { getYearPictureSrc };
