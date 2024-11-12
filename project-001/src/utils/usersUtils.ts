export const formatName = (name: string | undefined): string => {
    if (!name) return "";

    // Split the name into parts by spaces
    const nameParts = name.split(" ");

    // Capitalize each part of the name
    const formattedParts = nameParts.map((part) => {
        if (part.length === 0) return part;

        // Capitalize the first letter and make the rest lowercase
        return part[0].toUpperCase() + part.slice(1).toLowerCase();
    });

    // Join the parts back together with spaces
    console.log(formattedParts.join(" "))
    return formattedParts.join(" ");
}