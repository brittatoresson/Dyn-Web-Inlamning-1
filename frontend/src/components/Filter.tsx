export default function filterFunction(filter: string | undefined, context: CanvasFilters) {
    if (filter == "gray") {
        context.filter = "grayscale(100%)";
    }
    if (filter == "blur") {
        context.filter = "blur(5px)";
    }
    if (filter == "sepia") {
        context.filter = "sepia(1)";
    }
    if (filter == "low_fi") {
        context.filter = "saturate(1.1) contrast(1.5)";
    }
    if (filter == "contrast") {
        context.filter = "contrast(2.5)";
    }
}
