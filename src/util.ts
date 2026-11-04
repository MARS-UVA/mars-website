import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";

const images = import.meta.glob<ImageMetadata>(
    "./assets/images/**/*.{jpg,jpeg,png,webp}",
    { eager: true }
);

function getPicture(
    src: string,
): ImageMetadata | null {
    const match = Object.entries(images).find(([path]) => path.endsWith(src));

    if (match) {
        return (match[1] as any).default;
    }

    return null;
}

const peopleCollection = await getCollection("people");

const getYearPictureSrc = (
    person: (typeof peopleCollection)[number],
    type: "professional" | "profile" | "cat",
    year: number,
): ImageMetadata | null => {
    const pictures = {
        cat: person.data.catPictures,
        professional: person.data.professionalPictures,
        profile: person.data.profilePictures,
    }[type] ?? person.data.profilePictures;

    if (pictures) {
        // Find pictureSrc for the given year
        const pictureForYear = pictures.find((pic) => pic.year === year);
        if (pictureForYear) return getPicture(pictureForYear.src);

        if (type === "cat" && pictures.length > 0) {
            const newestPicture = pictures.reduce((newest, picture) =>
                picture.year > newest.year ? picture : newest,
            );
            return getPicture(newestPicture.src);
        }
    }

    // Default to defaultProfilePicture
    if (type === "professional") {
        const defaultPic = person.data.defaultProfessionalPicture;
        if (!defaultPic) return null;
        const src = person.data.professionalPictures?.find(
            (pic) => pic.year === defaultPic.year,
        )?.src;
        if (src) return getPicture(src);
    }

    const defaultPic = person.data.defaultProfilePicture;
    if (!defaultPic) return null;
    const src = person.data.profilePictures?.find(
        (pic) => pic.year === defaultPic.year,
    )?.src;
    if (src) return getPicture(src);

    return null;
};

const getYearPictureBaldSrc = (
    person: (typeof peopleCollection)[number],
    type: "professional" | "profile",
    year: number,
): string | null => {
    const pictures =
        type === "professional"
            ? person.data.professionalPictures
            : person.data.profilePictures;
    let picture = pictures?.find((candidate) => candidate.year === year);

    if (!picture && type === "professional") {
        const defaultProfessionalPicture = person.data.defaultProfessionalPicture;
        if (defaultProfessionalPicture) {
            picture = pictures?.find(
                (candidate) =>
                    candidate.year === defaultProfessionalPicture.year,
            );
        }
    }

    if (!picture) {
        const defaultProfilePicture = person.data.defaultProfilePicture;
        if (defaultProfilePicture) {
            picture = person.data.profilePictures?.find(
                (candidate) => candidate.year === defaultProfilePicture.year,
            );
        }
    }

    return picture?.baldSrc ? getPicture(picture.baldSrc)?.src ?? null : null;
};

export { getPicture, getYearPictureBaldSrc, getYearPictureSrc };
